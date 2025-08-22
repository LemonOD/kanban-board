
const SkeletonLoader = () => (
    <div className="pt-20 pb-8 px-4 max-w-7xl mx-auto space-y-6">
        <div className="flex justify-between items-center">
            <div className="h-8 w-1/3 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
            <div className="h-4 w-1/6 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
        </div>
        <div className="mb-4">
            <div className="h-8 w-full bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 min-h-[600px]">
            {[...Array(3)].map((_, idx) => (
                <div key={idx} className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 flex flex-col">
                    <div className="h-6 w-1/2 bg-gray-200 dark:bg-gray-700 rounded mb-4 animate-pulse" />
                    {[...Array(4)].map((__, i) => (
                        <div key={i} className="flex items-center space-x-2 mb-3">
                            <div className="h-4 w-4 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse" />
                            <div className="h-4 w-3/4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                        </div>
                    ))}
                    <div className="mt-auto pt-4">
                        <div className="h-8 w-full bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                    </div>
                </div>
            ))}
        </div>
    </div>
);

export default SkeletonLoader;