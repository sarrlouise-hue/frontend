const CLOUDINARY_CLOUD_NAME = 'dt8fos8ws';
const CLOUDINARY_UPLOAD_PRESET = 'allotracteur';

export interface CloudinaryUploadResponse {
  secure_url: string;
  public_id: string;
  url: string;
  format: string;
  width: number;
  height: number;
}

export const cloudinaryService = {
  /**
   * Upload an image to Cloudinary
   * @param file - File object to upload
   * @returns Promise with the uploaded image URL and metadata
   */
  async uploadImage(file: File): Promise<CloudinaryUploadResponse> {
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);
      formData.append('cloud_name', CLOUDINARY_CLOUD_NAME);

      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
        {
          method: 'POST',
          body: formData,
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || 'Failed to upload image');
      }

      const data = await response.json();
      return data;
    } catch (error: any) {
      console.error('Error uploading to Cloudinary:', error);
      throw new Error(error.message || 'Failed to upload image');
    }
  },

  /**
   * Upload multiple images to Cloudinary
   * @param files - Array of File objects to upload
   * @returns Promise with array of uploaded image URLs
   */
  async uploadMultipleImages(files: File[]): Promise<string[]> {
    try {
      const uploadPromises = files.map(file => this.uploadImage(file));
      const results = await Promise.all(uploadPromises);
      return results.map(result => result.secure_url);
    } catch (error: any) {
      console.error('Error uploading multiple images:', error);
      throw new Error(error.message || 'Failed to upload images');
    }
  },

  /**
   * Delete an image from Cloudinary
   * @param _publicId - Public ID of the image to delete
   */
  async deleteImage(_publicId: string): Promise<void> {
    // Note: Deleting images requires authentication with API key and secret
    // For security, this should be done from the backend
    // This is a placeholder for future implementation
    console.warn('Image deletion should be handled by the backend');
  },

  /**
   * Get optimized image URL with transformations
   * @param url - Original Cloudinary URL
   * @param options - Transformation options
   */
  getOptimizedUrl(
    url: string,
    options?: {
      width?: number;
      height?: number;
      quality?: number;
      crop?: 'fill' | 'fit' | 'scale' | 'crop';
    }
  ): string {
    if (!url || !url.includes('cloudinary.com')) {
      return url;
    }

    const transformations: string[] = [];

    if (options?.width) {
      transformations.push(`w_${options.width}`);
    }

    if (options?.height) {
      transformations.push(`h_${options.height}`);
    }

    if (options?.quality) {
      transformations.push(`q_${options.quality}`);
    }

    if (options?.crop) {
      transformations.push(`c_${options.crop}`);
    }

    if (transformations.length === 0) {
      return url;
    }

    // Insert transformations into the URL
    const parts = url.split('/upload/');
    if (parts.length !== 2) {
      return url;
    }

    return `${parts[0]}/upload/${transformations.join(',')}/${parts[1]}`;
  },

  /**
   * Generate thumbnail URL
   * @param url - Original Cloudinary URL
   */
  getThumbnailUrl(url: string): string {
    return this.getOptimizedUrl(url, {
      width: 300,
      height: 300,
      crop: 'fill',
      quality: 80,
    });
  },

  /**
   * Generate medium size URL
   * @param url - Original Cloudinary URL
   */
  getMediumUrl(url: string): string {
    return this.getOptimizedUrl(url, {
      width: 800,
      quality: 85,
      crop: 'fit',
    });
  },

  /**
   * Generate large size URL
   * @param url - Original Cloudinary URL
   */
  getLargeUrl(url: string): string {
    return this.getOptimizedUrl(url, {
      width: 1200,
      quality: 90,
      crop: 'fit',
    });
  },
};
