# coding=utf-8
"""
    @project: maxkb
    @Author：虎
    @file： pdf_to_md_handle.py
    @date：2024/3/27 18:19
    @desc:
"""
import re
from typing import List
import fitz  # PyMuPDF
from markdownify import markdownify as md

from common.handle.base_split_handle import BaseSplitHandle
from common.util.split_model import SplitModel

default_pattern_list = [
    re.compile(r'(?<=^)# .*|(?<=\n)# .*'),
    re.compile(r'(?<=\n)(?<!#)## (?!#).*|(?<=^)(?<!#)## (?!#).*'),
    re.compile(r'(?<=\n)(?<!#)### (?!#).*|(?<=^)(?<!#)### (?!#).*'),
    re.compile(r'(?<=\n)(?<!#)#### (?!#).*|(?<=^)(?<!#)#### (?!#).*'),
    re.compile(r'(?<=\n)(?<!#)##### (?!#).*|(?<=^)(?<!#)##### (?!#).*'),
    re.compile(r'(?<=\n)(?<!#)###### (?!#).*|(?<=^)(?<!#)###### (?!#).*'),
    re.compile(r'(?<!\n)\n\n+')
]

def pdf_to_md(pdf_document):
    markdown_text = []
    for page_number in range(len(pdf_document)):
        page = pdf_document.load_page(page_number)
        html = page.get_text("html")
        markdown_text.append(md(html))
    return "\n".join(markdown_text)

class PdfToMdSplitHandle(BaseSplitHandle):
    def handle(self, file, pattern_list: List, with_filter: bool, limit: int, get_buffer, save_image):
        try:
            buffer = get_buffer(file)
            pdf_document = fitz.open(file.name, buffer)
            markdown_content = pdf_to_md(pdf_document)
            split_model = SplitModel(
                pattern_list or default_pattern_list, with_filter=with_filter, limit=limit
            )
        except (IOError, fitz.FitzError) as e:
            return {'name': file.name, 'content': []}
        return {'name': file.name, 'content': split_model.parse(markdown_content)}

    def support(self, file, get_buffer):
        return file.name.lower().endswith(".pdf")