"use client"

import { useState, useEffect } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"

export function ImageSlider({ images, autoPlay = true, autoPlayInterval = 5000 }) {
  const [currentSlide, setCurrentSlide] = useState(0)

  useEffect(() => {
    if (!autoPlay || !images || images.length === 0) return

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % images.length)
    }, autoPlayInterval)

    return () => clearInterval(interval)
  }, [autoPlay, autoPlayInterval, images])

  const goToSlide = (index) => {
    setCurrentSlide(index)
  }

  const goToPrevious = () => {
    setCurrentSlide((prev) => (prev - 1 + images.length) % images.length)
  }

  const goToNext = () => {
    setCurrentSlide((prev) => (prev + 1) % images.length)
  }

  if (!images || images.length === 0) {
    return (
      <div className="image-slider">
        <div className="slider-container">
          <div className="slide active">
            <img src="/placeholder.svg?height=500&width=1200&text=No+Images" alt="No images available" />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="image-slider">
      <div className="slider-container">
        {images.map((image, index) => (
          <div key={index} className={`slide ${index === currentSlide ? "active" : ""}`}>
            <img src={image || "/placeholder.svg"} alt={`Slide ${index + 1}`} />
          </div>
        ))}

        {/* Navigation arrows */}
        {images.length > 1 && (
          <>
            <button className="slider-nav prev" onClick={goToPrevious}>
              <ChevronLeft size={24} />
            </button>
            <button className="slider-nav next" onClick={goToNext}>
              <ChevronRight size={24} />
            </button>

            {/* Dots indicator */}
            <div className="slider-dots">
              {images.map((_, index) => (
                <button
                  key={index}
                  className={`dot ${index === currentSlide ? "active" : ""}`}
                  onClick={() => goToSlide(index)}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  )
}
