// Create as app/api/upload-profile-image/route.js
import { NextResponse } from 'next/server'
import path from 'path'
import { writeFile, mkdir } from 'fs/promises'

export async function POST(request) {
  try {
    const formData = await request.formData()
    const profileImage = formData.get('profileImage')

    if (!profileImage) {
      return NextResponse.json(
        { error: 'No profile image provided' },
        { status: 400 }
      )
    }

    const buffer = Buffer.from(await profileImage.arrayBuffer())
    const filename = profileImage.name
    
    // Create uploads directory if it doesn't exist
    const uploadDir = path.join(process.cwd(), 'public/uploads/profiles')
    
    try {
      await mkdir(uploadDir, { recursive: true })
    } catch (err) {
      console.error('Error creating directory:', err)
    }
    
    // Write the file to the server
    const filePath = path.join(uploadDir, filename)
    await writeFile(filePath, buffer)
    
    return NextResponse.json({ 
      success: true, 
      message: 'Profile image uploaded successfully',
      filePath: `/uploads/profiles/${filename}`
    })
  } catch (error) {
    console.error('Error uploading file:', error)
    return NextResponse.json(
      { error: 'Error uploading file' },
      { status: 500 }
    )
  }
}

// Create as app/api/check-profile-image/route.js
export async function GET(request) {
  const url = new URL(request.url)
  const userId = url.searchParams.get('userId')
  
  if (!userId) {
    return NextResponse.json(
      { error: 'User ID is required' },
      { status: 400 }
    )
  }
  
  try {
    const uploadDir = path.join(process.cwd(), 'public/uploads/profiles')
    
    try {
      // Create directory if it doesn't exist yet
      await mkdir(uploadDir, { recursive: true })
    } catch (err) {
      // Directory might already exist
    }
    
    // Get all files in the directory
    const files = await readdir(uploadDir)
    
    // Find a file that starts with the userId
    const userImage = files.find(file => file.startsWith(`${userId}_`))
    
    if (userImage) {
      return NextResponse.json({
        exists: true,
        filename: userImage,
        imagePath: `/uploads/profiles/${userImage}`
      })
    } else {
      return NextResponse.json({ exists: false })
    }
  } catch (error) {
    console.error('Error checking for profile image:', error)
    return NextResponse.json(
      { error: 'Error checking for profile image' },
      { status: 500 }
    )
  }
}