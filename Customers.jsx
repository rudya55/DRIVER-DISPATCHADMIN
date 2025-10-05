import React, { useState } from 'react';

function Customers() {
  const [customers] = useState([
    { id: 1, name: 'Sophie Bernard', rides: 15, rating: 4.8 },
    { id: 2, name: 'Lucas Petit', rides: 8, rating: 4.6 },
    { id: 3, name: 'Emma Roux', rides: 23, rating: 4.9 },
  ]);

  return (
    <div>
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h2 className="text-2xl font-bold text-gray-900">Clients</h2>
        </div>
        <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
          <button
            type="button"
            className="inline-flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700"
          >
            Ajouter un client
          </button>
        </div>
      </div>
      <div className="mt-8 flex flex-col">
        <div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
            <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
              <table className="min-w-full divide-y divide-gray-300">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Nom</th>
                    <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Courses totales</th>
                    <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Note moyenne</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {customers.map((customer) => (
                    <tr key={customer.id}>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{customer.name}</td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{customer.rides}</td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{customer.rating}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Customers;