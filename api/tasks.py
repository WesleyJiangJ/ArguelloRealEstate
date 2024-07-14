import os
import sys
import django

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "RealEstate.settings")
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))
django.setup()

import schedule
import time
from views import send_database

schedule.every(3).days.do(send_database)

while True:
    schedule.run_pending()
    time.sleep(1)
