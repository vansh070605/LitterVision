import tensorflow as tf
from tensorflow.keras.preprocessing.image import ImageDataGenerator
from tensorflow.keras.applications import MobileNetV2
from tensorflow.keras.layers import Dense, GlobalAveragePooling2D
from tensorflow.keras.models import Model

# -------------------------
# CONFIG
# -------------------------
IMG_SIZE = 224
BATCH_SIZE = 32
EPOCHS = 10
DATASET_PATH = "Dataset"

# -------------------------
# DATA GENERATORS
# -------------------------
datagen = ImageDataGenerator(
    rescale=1.0 / 255,
    validation_split=0.2
)

train_gen = datagen.flow_from_directory(
    DATASET_PATH,
    target_size=(IMG_SIZE, IMG_SIZE),
    batch_size=BATCH_SIZE,
    class_mode="categorical",
    subset="training"
)

val_gen = datagen.flow_from_directory(
    DATASET_PATH,
    target_size=(IMG_SIZE, IMG_SIZE),
    batch_size=BATCH_SIZE,
    class_mode="categorical",
    subset="validation"
)

# -------------------------
# PRINT CLASS ORDER (VERY IMPORTANT)
# -------------------------
print("\nClass indices (USE THIS ORDER IN app.py):")
print(train_gen.class_indices)

# -------------------------
# MODEL: MobileNetV2
# -------------------------
base_model = MobileNetV2(
    input_shape=(IMG_SIZE, IMG_SIZE, 3),
    include_top=False,
    weights="imagenet"
)

# Freeze base model
base_model.trainable = False

# Custom classification head
x = base_model.output
x = GlobalAveragePooling2D()(x)
x = Dense(128, activation="relu")(x)
outputs = Dense(train_gen.num_classes, activation="softmax")(x)

model = Model(inputs=base_model.input, outputs=outputs)

# -------------------------
# COMPILE MODEL
# -------------------------
model.compile(
    optimizer="adam",
    loss="categorical_crossentropy",
    metrics=["accuracy"]
)

# -------------------------
# MODEL SUMMARY
# -------------------------
model.summary()

# -------------------------
# TRAIN MODEL
# -------------------------
history = model.fit(
    train_gen,
    validation_data=val_gen,
    epochs=EPOCHS
)

# -------------------------
# SAVE MODEL
# -------------------------
model.save("model.h5")
print("\n✅ Training complete!")
print("✅ Model saved as model.h5")
