import React, { useState } from "react";
import { ChevronLeft, ChevronRight, Tractor } from "lucide-react";

interface ServiceGalleryProps {
	images: string[];
	name: string;
}

export const ServiceGallery: React.FC<ServiceGalleryProps> = ({
	images,
	name,
}) => {
	const [currentImageIndex, setCurrentImageIndex] = useState(0);

	const nextImage = () => {
		if (images.length) {
			setCurrentImageIndex((prev) => (prev + 1) % images.length);
		}
	};

	const previousImage = () => {
		if (images.length) {
			setCurrentImageIndex(
				(prev) => (prev - 1 + images.length) % images.length
			);
		}
	};

	return (
		<div className="mb-8">
			<div className="relative h-[400px] w-full bg-gray-100 rounded-xl overflow-hidden mb-4">
				{images.length > 0 ? (
					<>
						<img
							src={images[currentImageIndex]}
							alt={name}
							className="w-full h-full object-cover"
						/>
						{images.length > 1 && (
							<>
								<button
									onClick={previousImage}
									className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/90 p-2 rounded-full hover:bg-white transition-all shadow-md"
								>
									<ChevronLeft className="w-6 h-6 text-gray-900" />
								</button>
								<button
									onClick={nextImage}
									className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/90 p-2 rounded-full hover:bg-white transition-all shadow-md"
								>
									<ChevronRight className="w-6 h-6 text-gray-900" />
								</button>
							</>
						)}
					</>
				) : (
					<div className="w-full h-full flex items-center justify-center">
						<Tractor className="w-32 h-32 text-gray-300" />
					</div>
				)}
			</div>

			{images.length > 1 && (
				<div className="flex space-x-3 overflow-x-auto pb-2">
					{images.map((src, index) => (
						<button
							key={index}
							onClick={() => setCurrentImageIndex(index)}
							className={`relative flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
								index === currentImageIndex
									? "border-green-600 ring-2 ring-green-100"
									: "border-transparent opacity-70 hover:opacity-100"
							}`}
						>
							<img
								src={src}
								alt={`${name} thumbnail ${index + 1}`}
								className="w-full h-full object-cover"
							/>
						</button>
					))}
				</div>
			)}
		</div>
	);
};
