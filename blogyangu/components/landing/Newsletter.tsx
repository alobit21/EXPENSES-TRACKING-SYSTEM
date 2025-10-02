"use client"

export default function Newsletter() {
  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    alert("Subscribed! Thank you.")
  }

  return (
    <section id="newsletter" className="bg-white text-gray-900 border-t border-border dark:bg-gray-900 dark:text-white dark:border-gray-800">
      <div className="container mx-auto px-4 py-12 max-w-3xl">
        <h3 className="text-xl font-semibold">Stay in the loop</h3>
        <p className="text-muted-foreground mt-1 dark:text-gray-400">Get the best posts delivered to your inbox. No spam, unsubscribe anytime.</p>
        <form onSubmit={onSubmit} className="mt-4 flex gap-2">
          <input
            type="email"
            required
            placeholder="you@example.com"
            className="flex-1 px-4 py-3 rounded-lg bg-background text-foreground border border-input focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-600 dark:bg-gray-800 dark:text-white dark:border-gray-700"
          />
          <button className="px-5 py-3 rounded-lg bg-green-600 hover:bg-green-700">Subscribe</button>
        </form>
      </div>
    </section>
  )
}
