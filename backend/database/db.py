from supabase import create_client
import os
from dotenv import load_dotenv

load_dotenv()#load var from .env/ex: url and key.

#Reads values from environment variables.
url = os.getenv("SUPABASE_URL")
key = os.getenv("SUPABASE_KEY")

supabase = create_client(url, key)

def get_all_students():

    response = supabase.table(
        "students"
    ).select("*").execute()

    return response.data