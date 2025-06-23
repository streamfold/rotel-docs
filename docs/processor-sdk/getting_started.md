---
sidebar_position: 2
---

# Getting Started

## Install or build a Python processor enabled release

In order to use the Rotel Python processor SDK you need a `python processor enabled` rotel build. Processor enabled rotel builds link to specific versions of libpython at build time. There are a couple of ways to get a processor enabled build.

1. Download a prebuilt Rotel python processor enabled binary. You can find prebuilt python processor enabled binaries for rotel at Github on the [releases](https://github.com/streamfold/rotel/releases) page. Python processor versions of Rotel are prefixed with the string `rotel_py_processor`. Choose a release that matches your system architecture and the version of Python you have installed. 

    For example if you are running rotel on linux x86_64 with Python 3.13 installed, choose `rotel_py_processor_3.13_v0.0.1-alpha19_x86_64-unknown-linux-gnu.tar.gz`.

2. Build from source.
```
git clone git@github.com:streamfold/rotel.git; cd rotel
cargo build --features pyo3 --release
```

