import { NextApiRequest, NextApiResponse } from "next";
import formidable from "formidable";
import fs from "fs";
import { prisma } from "../../../lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";

export const config = { api: { bodyParser: false } };

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const postId = parseInt(req.query.id as string);
  if (isNaN(postId)) return res.status(400).json({ message: "Invalid post ID" });

  // GET is unchanged
  if (req.method === "GET") {
    const post = await prisma.post.findUnique({
      where: { id: postId },
      select: {
        id: true,
        title: true,
        content: true,
        excerpt: true,
        coverImage: true,
        author: { select: { id: true, displayName: true, username: true, avatarUrl: true } },
        publishedAt: true,
        allowComments: true,
      },
    });
    if (!post) return res.status(404).json({ message: "Post not found" });
    return res.json(post);
  }

  // Protected: PUT / DELETE
  const session = await getServerSession(req, res, authOptions);
  const role = session?.user?.role;
  if (!session || !["ADMIN", "AUTHOR"].includes(role ?? "")) {
    return res.status(403).json({ message: "Forbidden" });
  }

  const existingPost = await prisma.post.findUnique({ where: { id: postId } });
  if (!existingPost) return res.status(404).json({ message: "Post not found" });
  if (role === "AUTHOR" && existingPost.authorId !== parseInt(session.user.id)) {
    return res.status(403).json({ message: "Forbidden" });
  }

  if (req.method === "PUT") {
    const form = formidable({ multiples: false, keepExtensions: true });
    form.parse(req, async (err, fields, files) => {
      if (err) return res.status(500).json({ message: "Form parse error" });

     const updateData: any = {
  title: Array.isArray(fields.title) ? fields.title[0] : fields.title,
  content: Array.isArray(fields.content) ? fields.content[0] : fields.content,
  excerpt: fields.excerpt ? (Array.isArray(fields.excerpt) ? fields.excerpt[0] : fields.excerpt) : null,
  metaDescription: fields.metaDescription ? (Array.isArray(fields.metaDescription) ? fields.metaDescription[0] : fields.metaDescription) : null,
  status: Array.isArray(fields.status) ? fields.status[0] : fields.status,
  allowComments: (Array.isArray(fields.allowComments) ? fields.allowComments[0] : fields.allowComments) === "true",
  categoryId: fields.categoryId ? parseInt(Array.isArray(fields.categoryId) ? fields.categoryId[0] : fields.categoryId) : null,
};


      // Handle cover image
      if (files.coverImage) {
        const file = Array.isArray(files.coverImage) ? files.coverImage[0] : files.coverImage;
        const newPath = `/uploads/${file.originalFilename}`;
        fs.renameSync(file.filepath, `./public${newPath}`);
        updateData.coverImage = newPath;
      }

      const updatedPost = await prisma.post.update({
        where: { id: postId },
        data: updateData,
      });

      return res.json(updatedPost);
    });
    return;
  }

  if (req.method === "DELETE") {
    await prisma.post.delete({ where: { id: postId } });
    return res.status(204).end();
  }

  res.setHeader("Allow", ["GET", "PUT", "DELETE"]);
  return res.status(405).end(`Method ${req.method} Not Allowed`);
}
