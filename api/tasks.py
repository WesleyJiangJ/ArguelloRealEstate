import os
import sys
import django

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "RealEstate.settings")
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))
django.setup()

import schedule
import time
from datetime import datetime, timedelta
from views import send_database

STATE_FILE = "last_run.txt"


def job():
    send_database()
    with open(STATE_FILE, "w") as f:
        f.write(datetime.now().isoformat())


def get_last_run_time():
    if os.path.exists(STATE_FILE):
        with open(STATE_FILE, "r") as f:
            last_run = f.read().strip()
            return datetime.fromisoformat(last_run)
    return None


last_run_time = get_last_run_time()

if last_run_time:
    next_run_time = last_run_time + timedelta(days=3)
    if datetime.now() >= next_run_time:
        job()
else:
    job()

schedule.every(3).days.do(job)

while True:
    schedule.run_pending()
    time.sleep(1)
