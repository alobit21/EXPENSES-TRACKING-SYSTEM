import { NextResponse } from "next/server"
import formidable from "formidable"
import fs from "fs"
import path from "path"

export const config = {
  api: {
    bodyParser: false,
  },
}

const uploadDir = path.join(process.cwd(), "public/uploads")
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true })
}

export async function POST(req: Request): Promise<Response> {
  return new Promise((resolve, reject) => {
    const form = formidable({
      multiples: false,
      uploadDir,
      keepExtensions: true,
      filename: (name, ext, part) => Date.now().toString() + "_" + part.originalFilename,
    })

    form.parse(req as any, (err, fields, files) => {
      if (err) {
        resolve(NextResponse.json({ error: "Upload failed" }, { status: 500 }))
        return
      }

      const file = files.file?.[0]
      if (!file) {
        resolve(NextResponse.json({ error: "No file uploaded" }, { status: 400 }))
        return
      }

      const fileName = path.basename(file.filepath)
      const fileUrl = `/uploads/${fileName}`

      resolve(NextResponse.json({ url: fileUrl }))
    })
  })
}
