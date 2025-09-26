"use client"

import { useState } from "react"

import { Button } from "../components/ui/button"
import { Card, CardContent } from "../components/ui/card"
import { Img } from "react-image"

const XIcon = () => (
  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
  </svg>
)

const StarIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="currentColor" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
    />
  </svg>
)

const MapPinIcon = () => (
  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
    />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
)

const CalendarIcon = () => (
  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
    />
  </svg>
)

const ClockIcon = () => (
  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
    />
  </svg>
)

const PhoneIcon = () => (
  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
    />
  </svg>
)

const MailIcon = () => (
  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
    />
  </svg>
)

interface Professional {
  id: number
  name: string
  category: string
  rating: number
  reviewCount: number
  hourlyRate: number
  bio: string
  skills: string[]
  profileImageURL: string
  workGalleryURLs: string[]
  availability: string
  location: string
}

interface ProfessionalProfileModalProps {
  professional: Professional | null
  isOpen: boolean
  onClose: () => void
  onBookNow: () => void
}

const sampleReviews = [
  {
    id: 1,
    name: "Sarah Johnson",
    rating: 5,
    comment: "Excellent work! Very professional and completed the job on time.",
    date: "2 weeks ago",
  },
  {
    id: 2,
    name: "Michael Chen",
    rating: 5,
    comment: "Highly recommend! Great attention to detail and fair pricing.",
    date: "1 month ago",
  },
  {
    id: 3,
    name: "Priya Patel",
    rating: 4,
    comment: "Good service overall. Would hire again for future projects.",
    date: "2 months ago",
  },
]

export default function ProfessionalProfileModal({
  professional,
  isOpen,
  onClose,
  onBookNow,
}: ProfessionalProfileModalProps) {
  const [activeTab, setActiveTab] = useState("about")

  if (!isOpen || !professional) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">Professional Profile</h2>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <XIcon />
          </Button>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Professional Info Header */}
          <div className="flex flex-col md:flex-row gap-6 mb-8">
            <div className="flex-shrink-0">
              <Img
                src={professional.profileImageURL || "/placeholder.svg"}
                alt={professional.name}
                width={120}
                height={120}
                className="rounded-full"
              />
            </div>

            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{professional.name}</h1>
              <p className="text-xl text-blue-600 font-semibold mb-3">{professional.category}</p>

              <div className="flex flex-wrap items-center gap-4 mb-4">
                <div className="flex items-center">
                  <StarIcon className="h-5 w-5 text-yellow-400" />
                  <span className="ml-1 font-semibold text-lg">{professional.rating}</span>
                  <span className="ml-1 text-gray-600">({professional.reviewCount} reviews)</span>
                </div>

                <div className="flex items-center text-gray-600">
                  <MapPinIcon />
                  <span className="ml-1">{professional.location}</span>
                </div>

                <div className="flex items-center text-green-600 font-medium">
                  <ClockIcon />
                  <span className="ml-1">{professional.availability}</span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <span className="text-2xl font-bold text-gray-900">₹{professional.hourlyRate}</span>
                  <span className="text-gray-600 ml-1">/visit</span>
                </div>

                <div className="flex gap-3">
                  <Button variant="outline" className="flex items-center bg-transparent">
                    <PhoneIcon />
                    <span className="ml-2">Call</span>
                  </Button>
                  <Button variant="outline" className="flex items-center bg-transparent">
                    <MailIcon />
                    <span className="ml-2">Message</span>
                  </Button>
                  <Button onClick={onBookNow} className="bg-blue-600 hover:bg-blue-700">
                    <CalendarIcon />
                    <span className="ml-2">Book Now</span>
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="border-b mb-6">
            <nav className="flex space-x-8">
              <button
                onClick={() => setActiveTab("about")}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === "about"
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700"
                }`}
              >
                About
              </button>
              <button
                onClick={() => setActiveTab("gallery")}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === "gallery"
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700"
                }`}
              >
                Work Gallery
              </button>
              <button
                onClick={() => setActiveTab("reviews")}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === "reviews"
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700"
                }`}
              >
                Reviews
              </button>
            </nav>
          </div>

          {/* Tab Content */}
          {activeTab === "about" && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">About Me</h3>
                <p className="text-gray-700 leading-relaxed">{professional.bio}</p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Skills & Expertise</h3>
                <div className="flex flex-wrap gap-2">
                  {professional.skills.map((skill, index) => (
                    <span key={index} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Service Areas</h3>
                <p className="text-gray-700">Available in {professional.location} and surrounding areas</p>
              </div>
            </div>
          )}

          {activeTab === "gallery" && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Previous Work</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {professional.workGalleryURLs.map((imageUrl, index) => (
                  <div key={index} className="aspect-square relative rounded-lg overflow-hidden">
                    <Img
                      src={imageUrl || "/placeholder.svg"}
                      alt={`Work sample ${index + 1}`}
                      className="object-cover hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "reviews" && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Customer Reviews</h3>
              <div className="space-y-4">
                {sampleReviews.map((review) => (
                  <Card key={review.id}>
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h4 className="font-medium text-gray-900">{review.name}</h4>
                          <div className="flex items-center mt-1">
                            {[...Array(5)].map((_, i) => (
                              <StarIcon
                                key={i}
                                className={`h-4 w-4 ${i < review.rating ? "text-yellow-400" : "text-gray-300"}`}
                              />
                            ))}
                          </div>
                        </div>
                        <span className="text-sm text-gray-500">{review.date}</span>
                      </div>
                      <p className="text-gray-700">{review.comment}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
