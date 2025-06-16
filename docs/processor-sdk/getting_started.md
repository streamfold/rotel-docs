---
sidebar_position: 2
---

# Getting Started

## Install or build a Python processor enabled release

In order to use the Rotel Python processor SDK you need a `python processor enabled` rotel build. Processor enabled rotel builds link to specific versions of libpython at build time. There are a couple of ways to get a processor enabled build of rotel.

1. Use [pyrotel](https://github.com/streamfold/pyrotel) | [pyrotel on pypi](https://pypi.org/project/rotel/) - Pyrotel is a an easy to use rotel python module that ships with a prebuilt processor enabled binary version of rotel.

2. Download a prebuilt rotel python processor enabled binary. You can find prebuilt python processor enabled binaries for rotel on Github at [releases](https://github.com/streamfold/rotel/releases). Python processor versions of Rotel are prefixed with the string `rotel_py_processor`. Choose a release that matches your system architecture and the version of Python you have installed. 

    For example if you are running rotel on linux x86_64 with Python 3.13 installed, choose `rotel_py_processor_3.13_v0.0.1-alpha17_x86_64-unknown-linux-gnu.tar.gz`.

3. Build from source.
```
git clone git@github.com:streamfold/rotel.git; cd rotel
cargo build --features pyo3 --release
```

