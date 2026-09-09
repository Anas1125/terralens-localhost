FROM python:3.9

WORKDIR /code

# Install FFmpeg / ffprobe for secure video validation
RUN apt-get update && \
    apt-get install -y --no-install-recommends ffmpeg && \
    rm -rf /var/lib/apt/lists/*

COPY ./requirements.txt /code/requirements.txt

RUN pip install --no-cache-dir --upgrade pip && \
    pip install --no-cache-dir uvicorn && \
    pip install --no-cache-dir -r /code/requirements.txt

COPY . /code

CMD ["python", "-m", "uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8080"]