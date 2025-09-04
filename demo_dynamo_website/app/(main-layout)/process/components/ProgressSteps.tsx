interface ProgressStepsProps {
    progress: number; // giá trị nhận được: 0 | 25 | 50 | 75 | 100
}

const ProgressSteps = ({ progress }: ProgressStepsProps) => {
    const steps = [0, 25, 50, 75, 100];

    return (
        <div className="my-0">
            <p className="mb-1 font-medium">Tiến độ</p>
            <div className="relative flex items-center justify-between">
                {/* Đường kẻ chính */}
                <div className="absolute top-4 left-0 right-0 h-[2px] bg-gray-300 -translate-y-1/2 z-0"></div>

                {steps.map((step) => {
                    const isCompleted = progress >= step;

                    return (
                        <div key={step} className="relative z-10 flex flex-col items-center">
                            <div
                                className={`w-8 h-8 flex items-center justify-center rounded-full border-2 ${isCompleted
                                    ? "bg-green-500 border-green-500 text-white"
                                    : "bg-white border-gray-300 text-gray-400"
                                    }`}
                            >
                                {isCompleted && step !== 0 ? (
                                    "✓"
                                ) : (
                                    <span className="text-xs font-semibold">{step === 0 ? "✓" : ""}</span>
                                )}
                            </div>
                            <span className="mt- text-xs text-gray-500">{step}%</span>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default ProgressSteps;
