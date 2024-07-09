# coding=utf-8
"""
    @project: maxkb
    @Author：虎
    @file： tokenizer_manage_config.py
    @date：2024/4/28 10:17
    @desc:
"""

from transformers import BertTokenizerFast

class TokenizerManage:
    tokenizer = None

    @staticmethod
    def get_tokenizer():
        if TokenizerManage.tokenizer is None:
            try:
                TokenizerManage.tokenizer = BertTokenizerFast.from_pretrained(
                    'hfl/chinese-roberta-wwm-ext',
                    cache_dir="/opt/maxkb/model/tokenizer",
                    local_files_only=True,
                    resume_download=False,
                    force_download=False
                )
            except Exception as e:
                print(f"Error loading tokenizer: {e}")
                raise
        return TokenizerManage.tokenizer
#
#
# class TokenizerManage:
#     tokenizer = None
#
#     @staticmethod
#     def get_tokenizer():
#         from transformers import GPT2TokenizerFast
#         if TokenizerManage.tokenizer is None:
#             TokenizerManage.tokenizer = GPT2TokenizerFast.from_pretrained(
#                 'openai-community/gpt2',
#                 cache_dir="/opt/maxkb/model/tokenizer",
#                 local_files_only=True,
#                 resume_download=False,
#                 force_download=False)
#         return TokenizerManage.tokenizer
