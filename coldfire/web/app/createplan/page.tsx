import React from 'react';
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";

const CreatePlan: React.FC = () => {
  return (
    <div className="mx-auto w-full max-w-[970px]">
      <Breadcrumb pageName="Create Plan" />
      <div className="rounded-[10px] bg-white p-6 shadow-1 dark:bg-gray-dark">
        <h2 className="mb-5 text-2xl font-bold text-dark dark:text-white">Create Your Plan</h2>
        <form>
          {/* Add form fields here */}
          <div className="mb-4">
            <label htmlFor="planName" className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Name
            </label>
            <input
              type="text"
              id="planName"
              name="planName"
              className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white"
              placeholder="Enter plan name"
            />
          </div>
          {/* Add more form fields as needed */}

          <div className="mb-4">
            <label htmlFor="planDescription" className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Description
            </label>
            <textarea
              id="planDescription"
              name="planDescription"
              rows={4}
              className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white"
              placeholder="Enter plan description"
            ></textarea>
          </div>

          <div className="mb-4">
            <label htmlFor="planType" className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Plan Type
            </label>
            <select
              id="planType"
              name="planType"
              
              className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white"
            >
              
              <option value="inheritance">Inheritance</option>
              <option value="emergency">Emergency</option>
              <option value="business">Business Continuity</option>
            </select>
          </div>

          <div className="mb-4">
            <label htmlFor="activationDate" className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Activation Date
            </label>
            <input
              type="date"
              id="activationDate"
              name="activationDate"
              className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white"
            />
          </div>

          <div className="mb-4">
            <label htmlFor="beneficiaries" className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Beneficiaries
            </label>
            <select
              id="beneficiaries"
              name="beneficiaries"
              multiple
              className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white"
            >
              {/* This should be populated dynamically with actual beneficiaries */}
             
            </select>
          </div>

          <div className="mb-4">
            <label htmlFor="assets" className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Assets to Include
            </label>
            <select
              id="assets"
              name="assets"
              multiple
              className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white"
            >
              {/* This should be populated dynamically with actual assets */}
              <option value="asset1">Asset 1</option>
              <option value="asset2">Asset 2</option>
              <option value="asset3">Asset 3</option>
            </select>
          </div>

          <div className="mb-4">
            <label htmlFor="distributionRules" className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Distribution Rules
            </label>
            <textarea
              id="distributionRules"
              name="distributionRules"
              rows={4}
              className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white"
              placeholder="Enter distribution rules"
            ></textarea>
          </div>

          <div className="mb-4">
            <label htmlFor="conditions" className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Activation Conditions
            </label>
            <textarea
              id="conditions"
              name="conditions"
              rows={4}
              className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white"
              placeholder="Enter activation conditions"
            ></textarea>
          </div>
          <button
            type="submit"
            className="rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Create Plan
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreatePlan;
