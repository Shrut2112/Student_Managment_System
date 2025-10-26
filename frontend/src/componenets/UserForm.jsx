import React from 'react'

export default function UserForm({handleChange,formData}) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                First Name
              </label>
              <input
                type="text"
                name="first_name"
                value={formData.first_name || ""}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Last Name
              </label>
              <input
                type="text"
                name="last_name"
                value={formData.last_name || ""}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Username
              </label>
              <input
                type="text"
                name="username"
                value={formData.username || ""}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email || ""}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Password
              </label>
              <input
                type="password"
                name="password"
                value={formData.password || ""}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Confirm Password
              </label>
              <input
                type="password"
                name="cnfpassword"
                value={formData.cnfpassword || ""}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>
  )
}
