import { Progress } from "@/components/ui/progress";

interface StepsProps {
    stepNumber: number; // giá trị nhận được: 0 | 25 | 50 | 75 | 100
}

const Steps = ({ stepNumber }: StepsProps) => {

    return (
        <div className="my-0">
            <p className="mb-1 font-medium">Tiến độ</p>
            <Progress
                value={stepNumber}
                className={`w-[100%] ${stepNumber < 50
                    ? "[&>div]:!bg-red-500"
                    : stepNumber < 80
                        ? "[&>div]:!bg-yellow-500"
                        : "[&>div]:!bg-green-500"
                    }`}
            />
            <span className="text-sm font-semibold">
                {stepNumber.toFixed(0)}%
            </span>
        </div>
    );
};

export default Steps;
