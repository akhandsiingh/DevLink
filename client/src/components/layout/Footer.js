const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white py-6">
      <div className="container mx-auto px-4 text-center">
        <p>DevLink - Developer & Social Media Profile Aggregator</p>
        <p className="mt-2">© {new Date().getFullYear()} DevLink. All rights reserved.</p>
      </div>
    </footer>
  )
}

export default Footer
