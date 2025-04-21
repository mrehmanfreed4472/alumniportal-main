'use client'
import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { registerAlumni } from '@/redux/features/alumni/alumniSlice'

export default function AlumniRegistration() {
  const dispatch = useDispatch()
  const [skills, setSkills] = useState([])
  const [skillInput, setSkillInput] = useState('')
  const [experience, setExperience] = useState([{
    companyName: '',
    startingDate: '',
    isPresent: false,
    description: '',
    role: ''
  }])
  const [education, setEducation] = useState([{
    universityName: '',
    degree: '',
    startDate: '',
    endDate: '',
    isPresent: false
  }])
  const [projects, setProjects] = useState([{
    title: '',
    description: '',
    role: ''
  }])

  // Main form state
  const [formData, setFormData] = useState({
    about: '',
    contactInfo: {
      linkedin: '',
      github: '',
      email: '',
      location: ''
    },
    batch: ''
  })

  const handleInputChange = (e) => {
    const { name, value } = e.target
    if (name.includes('.')) {
      const [parent, child] = name.split('.')
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }))
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }))
    }
  }

  const handleArrayChange = (arrayName, index, field, value) => {
    const updatedArray = [...arrayName]
    updatedArray[index][field] = value
    switch(arrayName) {
      case experience:
        setExperience(updatedArray)
        break
      case education:
        setEducation(updatedArray)
        break
      case projects:
        setProjects(updatedArray)
        break
    }
  }

  const addSkill = (e) => {
    e.preventDefault()
    if (skillInput.trim()) {
      setSkills(prev => [...prev, skillInput.trim()])
      setSkillInput('')
    }
  }

  const addExperience = () => {
    setExperience(prev => [...prev, {
      companyName: '',
      startingDate: '',
      isPresent: false,
      description: '',
      role: ''
    }])
  }

  const addEducation = () => {
    setEducation(prev => [...prev, {
      universityName: '',
      degree: '',
      startDate: '',
      endDate: '',
      isPresent: false
    }])
  }

  const addProject = () => {
    setProjects(prev => [...prev, {
      title: '',
      description: '',
      role: ''
    }])
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    
    const payload = {
      ...formData,
      skills,
      experience,
      education,
      projects
    }

    // Dispatch Redux action
    dispatch(registerAlumni(payload))
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8">Alumni Registration</h1>
      
      <form onSubmit={handleSubmit} className="space-y-8">
        {/* About Section */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <label className="block text-sm font-medium mb-2">About</label>
          <textarea
            name="about"
            value={formData.about}
            onChange={handleInputChange}
            className="w-full p-2 border rounded-md"
            rows="4"
            required
          />
        </div>

        {/* Contact Info */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Contact Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="url"
              name="contactInfo.linkedin"
              value={formData.contactInfo.linkedin}
              onChange={handleInputChange}
              placeholder="LinkedIn URL"
              className="p-2 border rounded-md"
              required
            />
            <input
              type="url"
              name="contactInfo.github"
              value={formData.contactInfo.github}
              onChange={handleInputChange}
              placeholder="GitHub URL"
              className="p-2 border rounded-md"
              required
            />
            <input
              type="email"
              name="contactInfo.email"
              value={formData.contactInfo.email}
              onChange={handleInputChange}
              placeholder="Email"
              className="p-2 border rounded-md"
              required
            />
            <input
              type="text"
              name="contactInfo.location"
              value={formData.contactInfo.location}
              onChange={handleInputChange}
              placeholder="Location"
              className="p-2 border rounded-md"
              required
            />
          </div>
        </div>

        {/* Skills */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Skills</h2>
          <div className="flex gap-2 mb-4">
            <input
              type="text"
              value={skillInput}
              onChange={(e) => setSkillInput(e.target.value)}
              placeholder="Add skill"
              className="p-2 border rounded-md flex-1"
            />
            <button
              onClick={addSkill}
              className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
            >
              Add Skill
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {skills.map((skill, index) => (
              <span key={index} className="bg-gray-100 px-3 py-1 rounded-full">
                {skill}
              </span>
            ))}
          </div>
        </div>

        {/* Batch */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <label className="block text-sm font-medium mb-2">Graduation Batch</label>
          <input
            type="text"
            name="batch"
            value={formData.batch}
            onChange={handleInputChange}
            placeholder="e.g., 2025"
            className="p-2 border rounded-md w-full"
            required
          />
        </div>

        {/* Experience */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Experience</h2>
          {experience.map((exp, index) => (
            <div key={index} className="mb-6 border-b pb-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="text"
                  value={exp.companyName}
                  onChange={(e) => handleArrayChange(experience, index, 'companyName', e.target.value)}
                  placeholder="Company Name"
                  className="p-2 border rounded-md"
                  required
                />
                {/* Add other experience fields similarly */}
              </div>
            </div>
          ))}
          <button
            type="button"
            onClick={addExperience}
            className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600"
          >
            Add Experience
          </button>
        </div>

        {/* Add similar sections for Education and Projects */}

        <button
          type="submit"
          className="w-full bg-purple-500 text-white py-3 rounded-md hover:bg-purple-600 transition-colors"
        >
          Submit Registration
        </button>
      </form>
    </div>
  )
}