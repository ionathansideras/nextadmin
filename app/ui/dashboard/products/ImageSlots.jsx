"use client";

import { useState } from "react";
import styles from "./products.module.css"; // Add necessary styles

const ImageSlots = ({ maxImages = 10, imagesExisting = [] }) => {
    // Initialize state with existing images and ensure it stays in sync

    const [images, setImages] = useState([
        ...imagesExisting,
        ...Array(maxImages - imagesExisting.length).fill(null),
    ]);

    const handleFileChange = (index, file) => {
        const updatedImages = [...images];
        updatedImages[index] = file || null;
        setImages(updatedImages);
    };

    const handleRemoveImage = (index) => {
        const updatedImages = [...images];
        updatedImages[index] = null; // Clear the image slot
        setImages(updatedImages);
    };

    return (
        <div className={styles.imageSlots}>
            {images.map((image, index) => (
                <div key={index} className={styles.imageSlot}>
                    {image && (
                        <span
                            className={styles.removeButton}
                            onClick={() => handleRemoveImage(index)}
                        >
                            ×
                        </span>
                    )}
                    <label htmlFor={`image-${index}`}>
                        {image ? (
                            <img
                                src={
                                    typeof image === "string"
                                        ? image // Existing image URL
                                        : URL.createObjectURL(image) // New file preview
                                }
                                alt={`Preview ${index + 1}`}
                                className={styles.imagePreview}
                            />
                        ) : (
                            <div className={styles.placeholder}>
                                Click to Upload Image {index + 1}
                            </div>
                        )}
                    </label>
                    <input
                        type="file"
                        name={`images-${index}`}
                        id={`image-${index}`}
                        className={styles.fileInput}
                        accept="image/*"
                        onChange={(e) =>
                            handleFileChange(index, e.target.files[0])
                        }
                    />
                    {/* Add a hidden input for all slots (populated or not) */}
                    <input
                        type="hidden"
                        name={`slots-grid-${index}`}
                        value={
                            image
                                ? typeof image === "string"
                                    ? image
                                    : image.name
                                : ""
                        }
                    />
                </div>
            ))}
        </div>
    );
};

export default ImageSlots;
