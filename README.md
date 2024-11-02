# rbs-openai-simple-docker

This repository is an **experimental RBS-AI test bed** for web-service-like access to the OpenAI API. It serves as a simple proof of concept, demonstrating how assistants can support specific use cases, such as an assistant focused solely on encryption or other specialized topics. Additionally, it includes a tab for image generation and now supports language translation.

## Project Overview

This setup is a straightforward integration using OpenAI models exclusively. It relies entirely on OpenAI's models for all AI-driven functionality, including assistants, image generation, and language translation:
- **Backend**: Flask server to handle API requests.
- **Frontend**: React for the user interface.

## Features

- **Assistant Support**: Allows creation of specialized assistants, each tailored to specific topics or tasks. The assistants are controlled by files in a separate repository, providing flexibility to create new assistants or refine existing ones as needed.
- **Image Creation**: Includes a tab for generating images via the OpenAI API.
- **Language Translation**: Supports text translation between languages. If **auto-detect** is selected for the source language, the system uses the **lingua-py** package for language detection, which is licensed under the Apache 2.0 License.

## Limitations

This project is in an experimental phase and currently lacks:
- **Advanced Security**: Basic security checks are in place, but the project is not secure enough for production.
- **Detailed Configuration Options**: Some configurations and refinements are intentionally minimal for demonstration purposes.
- **Full Feature Set**: This proof of concept omits advanced functionalities in favor of a streamlined setup to illustrate core capabilities.

## Purpose

The purpose of this repository is to showcase the potential for AI-driven assistants in specific educational or informational contexts, providing insight into how such tools can be applied to real-world use cases.

## Assistants Repository

The assistants used in this project are managed in a separate repository, which can be found at: [rbs-openai-simple-docker-assistants](https://github.com/sandrodegiorgi/rbs-openai-simple-docker-assistants)

## License

This project is licensed under the MIT License. Please note that if the **auto-detect** feature for source language is used in translation, it relies on the **lingua-py** package, which is licensed under the Apache 2.0 License.


## Note
This project was developed entirely voluntarily by the Schwarzwald Bitschubbser.
