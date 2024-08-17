import React from "react";

function ProjectView() {
  return (
    <div className="bg-white dark:bg-gray-800 h-screen">
      <div className="relative pt-8">
        <div className="absolute inset-0 h-1/2 bg-gray-100 dark:bg-gray-700"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-lg mx-auto rounded-lg shadow-lg overflow-hidden lg:max-w-none lg:flex">
            <div className="flex-1 bg-white dark:bg-gray-900 px-6 py-8 lg:p-12">
              <h3 className="text-2xl font-extrabold text-gray-900 dark:text-white sm:text-3xl">Project Overview</h3>
              <p className="mt-6 text-base text-gray-500 dark:text-gray-300">
                Discover the powerful features of our new software tool designed to streamline your workflow and enhance productivity. This tool integrates seamlessly with your existing systems, providing real-time data insights and intuitive user experience.
              </p>
              <div className="mt-8">
                <div className="flex items-center">
                  <h4 className="flex-shrink-0 pr-4 bg-white dark:bg-gray-900 text-sm tracking-wider font-semibold uppercase text-rose-600">
                    Key Features
                  </h4>
                  <div className="flex-1 border-t-2 border-gray-200 dark:border-gray-600"></div>
                </div>
                <ul role="list" className="mt-8 space-y-5 lg:space-y-0 lg:grid lg:grid-cols-2 lg:gap-x-8 lg:gap-y-5">
                  <li className="flex items-start lg:col-span-1">
                    <div className="flex-shrink-0">
                      <svg
                        className="h-5 w-5 text-green-400 dark:text-green-500"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        aria-hidden="true"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                          clipRule="evenodd"
                        ></path>
                      </svg>
                    </div>
                    <p className="ml-3 text-sm text-gray-700 dark:text-gray-300">Real-time data integration</p>
                  </li>
                  <li className="flex items-start lg:col-span-1">
                    <div className="flex-shrink-0">
                      <svg
                        className="h-5 w-5 text-green-400 dark:text-green-500"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        aria-hidden="true"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                          clipRule="evenodd"
                        ></path>
                      </svg>
                    </div>
                    <p className="ml-3 text-sm text-gray-700 dark:text-gray-300">Seamless integration with existing tools</p>
                  </li>
                  <li className="flex items-start lg:col-span-1">
                    <div className="flex-shrink-0">
                      <svg
                        className="h-5 w-5 text-green-400 dark:text-green-500"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        aria-hidden="true"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                          clipRule="evenodd"
                        ></path>
                      </svg>
                    </div>
                    <p className="ml-3 text-sm text-gray-700 dark:text-gray-300">User-friendly interface</p>
                  </li>
                </ul>
              </div>
            </div>
            <div className="py-8 px-6 text-center bg-gray-50 dark:bg-gray-900 lg:flex-shrink-0 lg:flex lg:flex-col lg:justify-center lg:p-12">
              <p className="text-lg leading-6 font-medium text-gray-900 dark:text-white">Special Launch Offer</p>
              <div className="">
                <span style={{ opacity: 0.5 }} className="font-mono text-xl md:text-lg font-medium text-gray-400 dark:text-gray-400">$</span>
                <span style={{ opacity: 0.5 }} className="h1 line-through text-gray-600 dark:text-gray-400">299.99</span>
                <span className="line-through relative text-gray-600 dark:text-gray-400 text-center text-sm mb-4">/mo</span>
                <span className="text-red-600 text-sm">Special promotion</span>
              </div>
              <div className="mt-4 flex items-center justify-center text-5xl font-extrabold text-gray-900 dark:text-white">
                <span>$149.99</span>
                <span className="ml-3 text-xl font-medium text-gray-500 dark:text-gray-400">USD</span>
              </div>
              <div className="mt-6">
                <div className="rounded-md shadow">
                  <a
                    href="https://example.com/checkout"
                    className="flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-gray-800 dark:bg-gray-700 hover:bg-gray-900 dark:hover:bg-gray-600"
                  >
                    Get Started Now
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProjectView;
