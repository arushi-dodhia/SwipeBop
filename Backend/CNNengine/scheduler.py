from apscheduler.schedulers.background import BackgroundScheduler
from datetime import datetime
import image_downloader
import embedding_generator
from CNNengine.recommender import load_all_embeddings, catalog_embeddings as _dummy
import CNNengine.recommender as recommender

scheduler = BackgroundScheduler()

def refresh_job():
    print(f"[scheduler] Running refresh at {datetime.now().isoformat()}")
    image_downloader.download_images_batch()
    embedding_generator.generate_and_save_embeddings()
    recommender.catalog_embeddings = load_all_embeddings()
    print(f"[scheduler] Embeddings refreshed: {len(recommender.catalog_embeddings)} items")
    job = scheduler.get_job('refresh_job')
    if job and job.next_run_time:
        mins = int((job.next_run_time - datetime.now()).total_seconds() // 60)
        print(f"[scheduler] Next batch in {mins} minutes")

scheduler.add_job(refresh_job, 'interval', hours=2, id='refresh_job')
scheduler.start()
print("[scheduler] Next batch in 120 minutes")
