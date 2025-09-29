"use client"

export default function Newsletter() {
  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    alert("Subscribed! Thank you.")
  }

  return (
    <section id="newsletter" className="bg-gray-950 border-t border-gray-800">
      <div className="container mx-auto px-4 py-12 max-w-3xl">
        <h3 className="text-xl font-semibold">Stay in the loop</h3>
        <p className="text-gray-400 mt-1">Get the best posts delivered to your inbox. No spam, unsubscribe anytime.</p>
        <form onSubmit={onSubmit} className="mt-4 flex gap-2">
          <input
            type="email"
            required
            placeholder="you@example.com"
            className="flex-1 px-4 py-3 rounded-lg bg-gray-800 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-green-600"
          />
          <button className="px-5 py-3 rounded-lg bg-green-600 hover:bg-green-700">Subscribe</button>
        </form>
      </div>
    </section>
  )
}
