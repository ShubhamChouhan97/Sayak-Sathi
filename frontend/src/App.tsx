
const App = () => {
	
	return (
	 <div className="max-w-sm mx-auto bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300">
      <img
        className="w-full h-48 object-cover"
        src="https://source.unsplash.com/random/400x200"
        alt="Card Visual"
      />
      <div className="p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-2 bg-red-500">
          Beautiful Sunset
        </h2>
        <p className="text-gray-600 text-sm mb-4">
          Experience the breathtaking colors of nature with this sunset scene.
        </p>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition">
          Learn More
        </button>
      </div>
    </div>
	);
};

export default App;
