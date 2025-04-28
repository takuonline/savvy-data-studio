# from data_processing.permissions import IsOwnerOrReadOnly
from langchain_community.document_loaders import (
    PyPDFLoader,
    CSVLoader,
    TextLoader,
    UnstructuredHTMLLoader,
)
import os
import tempfile
import json
from pathlib import Path
import traceback
import logging

DATA_LOADERS = {
    "pdf": [PyPDFLoader],
    "csv": [CSVLoader],
    "text": [TextLoader],
    "html": [UnstructuredHTMLLoader],
}

logger = logging.getLogger(__name__)


# @shared_task
def convert_binary_to_file(f):
    try:
        suffix = f.name.split(".")[-1]
    except:
        suffix = ".txt"

    with tempfile.NamedTemporaryFile(delete=False, suffix=suffix) as temp_file:
        for chunk in f.chunks():
            temp_file.write(chunk)

    return temp_file.name


# @shared_task(serializer="pickle")
def handle_json(temp_file_path) -> str:
    data = json.loads(Path(temp_file_path).read_text())
    os.remove(temp_file_path)
    return str(data)


# @shared_task(serializer="pickle")
def handle_file_type(temp_file_path, loaders: list) -> str:
    """
    Try out all loaders before returning empty string
    """
    for loader in loaders:
        try:
            file_loader = loader(temp_file_path)
            data = file_loader.load()
            os.remove(temp_file_path)

            return " ".join([i.page_content for i in data])
        except:
            traceback.print_exc()
            continue
    return ""


# @shared_task(serializer="pickle")
def handle_file_upload(
    file,
):
    temp_file_path = convert_binary_to_file(file)

    if file.name.endswith("pdf"):
        parsed_data = handle_file_type(temp_file_path, DATA_LOADERS["pdf"])

    elif file.name.endswith("csv"):
        parsed_data = handle_file_type(temp_file_path, DATA_LOADERS["csv"])

    elif file.name.endswith("html"):
        parsed_data = handle_file_type(temp_file_path, DATA_LOADERS["html"])

    elif file.name.endswith("json"):
        parsed_data = handle_json(temp_file_path)

    elif (
        file.name.endswith("md")
        or file.name.endswith("txt")
        or file.name.endswith("ipynb")
        or file.name.endswith("text")
    ):
        parsed_data = handle_file_type(temp_file_path, DATA_LOADERS["text"])

    else:
        parsed_data = ""
    logger.info(file.name)
    return {"file_name": file.name, "data": parsed_data}
