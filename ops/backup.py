#!/usr/bin/env python3
import datetime
import os
from pathlib import Path
import subprocess
import tarfile

os.umask(0o077)
directory = Path("/srv/zecflow/backups")
directory.mkdir(mode=0o700, exist_ok=True)
stamp = datetime.datetime.now(datetime.timezone.utc).strftime("%Y%m%dT%H%M%SZ")
dump = directory / f"zecflow-{stamp}.dump"
temporary = dump.with_suffix(".partial")
try:
    with temporary.open("xb") as output:
        subprocess.run(
            ["docker", "exec", "zecflow-db", "pg_dump", "-U", "zecflow", "-d", "zecflow", "-Fc"],
            stdout=output,
            check=True,
        )
    with temporary.open("rb") as source:
        subprocess.run(
            ["docker", "exec", "-i", "zecflow-db", "pg_restore", "--list"],
            stdin=source,
            stdout=subprocess.DEVNULL,
            check=True,
        )
    temporary.replace(dump)
    with tarfile.open(directory / f"zecflow-storage-{stamp}.tar.gz", "x:gz") as archive:
        archive.add("/srv/zecflow/storage", arcname="storage")
finally:
    temporary.unlink(missing_ok=True)
