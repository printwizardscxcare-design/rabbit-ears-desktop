"""Ship upstream notices and the exact build environment's runtime licenses."""
import hashlib
import importlib.metadata
import json
from pathlib import Path
import shutil
import sys


def copy_licenses(output):
    source = Path(__file__).with_name("licenses")
    destination = Path(output) / "licenses"
    for entry in json.loads((source / "SOURCES.json").read_text(encoding="utf-8")):
        data = (source / entry["file"]).read_bytes()
        if hashlib.sha256(data).hexdigest() != entry["sha256"]:
            raise RuntimeError(f"Upstream license checksum mismatch: {entry['file']}")
    shutil.copytree(source, destination, dirs_exist_ok=True)
    runtime = destination / "build-runtime"
    runtime.mkdir(exist_ok=True)
    versions = {}
    for package in ("ctranslate2", "sentencepiece", "numpy", "setuptools", "PyYAML", "pyinstaller"):
        distribution = importlib.metadata.distribution(package)
        versions[package] = distribution.version
        copied = 0
        for member in distribution.files or []:
            if not any(word in member.name.lower() for word in ("license", "copying", "notice")):
                continue
            origin = Path(distribution.locate_file(member))
            if not origin.is_file():
                continue
            # Preserve nested vendor notices without allowing wheel-relative '..' paths.
            relative = Path(*[part for part in member.parts if part not in ("..", ".")])
            target = runtime / package / relative
            target.parent.mkdir(parents=True, exist_ok=True)
            shutil.copyfile(origin, target)
            copied += 1
        if package in ("numpy", "setuptools") and not copied:
            raise RuntimeError(f"Missing installed {package} license files")
    python_license = Path(sys.base_prefix) / "LICENSE.txt"
    if python_license.is_file():
        shutil.copyfile(python_license, runtime / "CPython-LICENSE.txt")
    versions["CPython"] = sys.version
    (runtime / "VERSIONS.json").write_text(json.dumps(versions, indent=2) + "\n", encoding="utf-8")
    print(f"Copied translation notices to {destination}")


if __name__ == "__main__":
    copy_licenses(sys.argv[1])
