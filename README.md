# StarCloudKB  （ Still in the early stage of development, don't use this until I remove this line)

<h3 align="center">Knowledge Base Question Answering System Based on LLM Large Language Models</h3>

<hr/>

StarCloudKB, originating from MaxKB, enhances the original system with multi-language support and role assignment features.

MaxKB = Max Knowledge Base, is an open-source knowledge base question answering system based on LLM large language models, designed to be the ultimate brain for enterprises.

- **Out-of-the-box**: Supports direct document uploads, automatic online document crawling, text auto-splitting, vectorization, RAG (Retrieval-Augmented Generation), and provides an excellent intelligent Q&A interaction experience.
- **Model-neutral**: Supports integration with various large language models, including local private models (Llama 3 / Qwen 2, etc.), domestic public models (Tongyi Qianwen / Zhipu AI / Baidu Qianfan / Kimi / DeepSeek, etc.), and international public models (OpenAI / Azure OpenAI / Gemini, etc.).
- **Flexible orchestration**: Built-in powerful workflow engine supports AI work process orchestration to meet the demands of complex business scenarios.
- **Seamless embedding**: Supports rapid, zero-code embedding into third-party business systems, enabling existing systems to quickly gain intelligent Q&A capabilities and improve user satisfaction.

## Quick Start

```bash
docker run -d --name=maxkb -p 8080:8080 -v ~/.maxkb:/var/lib/postgresql/data cr2.fit2cloud.com/1panel/maxkb

# Username: admin
# Password: MaxKB@123..
```
You can also quickly deploy MaxKB + Ollama + Llama 3 through the [1Panel App Store](https://apps.fit2cloud.com/1panel), getting a local large model-based knowledge base question answering system online within 30 minutes and embedding it into third-party business systems.

For intranet environments, it is recommended to use the [offline installation package](https://community.fit2cloud.com/#/products/maxkb/downloads) for installation and deployment.

You can also experience it online: [DataEase Assistant](https://dataease.io/docs/v2/), an intelligent Q&A system built on MaxKB, already embedded in the DataEase product and online documentation.

If you need to build a technical blog or knowledge base, it is recommended to use the [Halo open-source website building tool](https://github.com/halo-dev/halo/). You can experience the official [technical blog](https://blog.fit2cloud.com/) and [knowledge base](https://kb.fit2cloud.com) cases from FIT2CLOUD.

For more questions, you can check the user manual or communicate with us through the forum.

- [User Manual](https://github.com/1Panel-dev/MaxKB/wiki/1-%E5%AE%89%E8%A3%85%E9%83%A8%E7%BD%B2)

## UI Showcase

<table style="border-collapse: collapse; border: 1px solid black;">
  <tr>
    <td style="padding: 5px;background-color:#fff;"><img src="https://github.com/1Panel-dev/MaxKB/assets/80892890/2b893a25-ae46-48da-b6a1-61d23015565e" alt="MaxKB Demo1" /></td>
    <td style="padding: 5px;background-color:#fff;"><img src="https://github.com/1Panel-dev/MaxKB/assets/80892890/3e50e7ff-cdc4-4a37-b430-d84975f11d4e" alt="MaxKB Demo2" /></td>
  </tr>
  <tr>
    <td style="padding: 5px;background-color:#fff;"><img src="https://github.com/1Panel-dev/MaxKB/assets/80892890/dfdcc03f-ef36-4f75-bb82-797c0f9da1ad" alt="MaxKB Demo3" /></td>
    <td style="padding: 5px;background-color:#fff;"><img src="https://github.com/1Panel-dev/MaxKB/assets/52996290/f8e36cad-b6d5-44bb-a9ab-8fa8e289377a" alt="MaxKB Demo4" /></td>
  </tr>
</table>

## Tech Stack

- Frontend: [Vue.js](https://cn.vuejs.org/)
- Backend: [Python / Django](https://www.djangoproject.com/)
- LangChain: [LangChain](https://www.langchain.com/)
- Vector Database: [PostgreSQL / pgvector](https://www.postgresql.org/)
- Large Models: Various local private or public large models


## License

Licensed under The GNU General Public License version 3 (GPLv3) (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at

<https://www.gnu.org/licenses/gpl-3.0.html>

Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
