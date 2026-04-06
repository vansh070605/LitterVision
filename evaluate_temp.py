import tensorflow as tf
from tensorflow.keras.preprocessing.image import ImageDataGenerator
from tensorflow.keras.models import load_model
import os

os.environ['TF_CPP_MIN_LOG_LEVEL'] = '3' 

IMG_SIZE = 224
BATCH_SIZE = 32
DATASET_PATH = "Dataset"

datagen = ImageDataGenerator(
    rescale=1.0 / 255,
    validation_split=0.2
)

val_gen = datagen.flow_from_directory(
    DATASET_PATH,
    target_size=(IMG_SIZE, IMG_SIZE),
    batch_size=BATCH_SIZE,
    class_mode="categorical",
    subset="validation",
    shuffle=False
)

try:
    model = load_model("model.h5")
    loss, accuracy = model.evaluate(val_gen, verbose=1)
    print(f"\nModel Validation Accuracy: {accuracy * 100:.2f}%")
except Exception as e:
    print(f"Error evaluating model: {e}")
