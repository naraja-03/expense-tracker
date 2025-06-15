import FloatingAddButton from "./FloatingAddButton";
import AddExpenseModal from "./AddExpenseModal";
import ExpenseDayCard from "./ExpenseDayCard";
import { useFabHover } from "@/context/AppContext";
import { useExpenses } from "@/context/ExpenseDataContext";
import { useState, useEffect, useRef } from "react";
import type { ExpenseItem } from "@/types/expense";

function getBottomRight() {
  const x = window.innerWidth - 80;
  const y = window.innerHeight - 180;
  return { x, y };
}

export default function ExpenseDaysList() {
  const { days, refetch } = useExpenses();
  const [modalOpen, setModalOpen] = useState(false);
  const [modalDate, setModalDate] = useState<string>("");
  const [btnPosition, setBtnPosition] = useState(getBottomRight());
  const [resettingBtn, setResettingBtn] = useState(false);

  const btnPositionRef = useRef(btnPosition);
  useEffect(() => { btnPositionRef.current = btnPosition; }, [btnPosition]);

  const cardRefs = useRef<{ [date: string]: HTMLDivElement | null }>({});
  const { setHoveredDate } = useFabHover();

  useEffect(() => {
    const setToBottomRight = () => setBtnPosition(getBottomRight());
    setToBottomRight();
    window.addEventListener("resize", setToBottomRight);
    return () => window.removeEventListener("resize", setToBottomRight);
  }, []);

  const animateButtonToInitial = () => {
    setResettingBtn(true);
    setBtnPosition(getBottomRight());
    setTimeout(() => setResettingBtn(false), 400);
  };

  const getDayUnderButton = (): string | null => {
    const BUTTON_SIZE = 64;
    const { x, y } = btnPositionRef.current;
    const centerX = x + BUTTON_SIZE / 2;
    const centerY = y + BUTTON_SIZE / 2;

    let nearestDate: string | null = null;
    let minDistance = Infinity;
    const THRESHOLD = 120;

    for (const day of days) {
      const ref = cardRefs.current[day.date];
      if (ref) {
        const rect = ref.getBoundingClientRect();
        if (
          centerX >= rect.left &&
          centerX <= rect.right &&
          centerY >= rect.top &&
          centerY <= rect.bottom
        ) {
          return day.date;
        }
        const cardCenterX = rect.left + rect.width / 2;
        const cardCenterY = rect.top + rect.height / 2;
        const distance = Math.sqrt(
          Math.pow(centerX - cardCenterX, 2) + Math.pow(centerY - cardCenterY, 2)
        );
        if (distance < minDistance) {
          minDistance = distance;
          nearestDate = day.date;
        }
      }
    }
    return minDistance <= THRESHOLD ? nearestDate : null;
  };

  // Update hoveredDate in context whenever btnPosition changes
  useEffect(() => {
    const dateUnder = getDayUnderButton();
    if (dateUnder) {
      setHoveredDate(dateUnder);
      setModalDate(dateUnder);
    } else {
      setHoveredDate(dateUnder);
    }
    // eslint-disable-next-line
  }, [btnPosition, days]);

  const handleFloatingButtonAction = () => {
    setModalOpen(true);
    animateButtonToInitial();
  };

  const handleModalClose = () => {
    setModalOpen(false);
    setModalDate("");
  };

  // Save new expense to API and refetch
  const handleModalSubmit = async (item: ExpenseItem, date: string) => {
    setModalOpen(false);
    setModalDate("");
    // POST to /api/expenses for new item
    await fetch("/api/expenses", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type: "add", date, newItem: item }),
    });
    await refetch();
  };

  return (
    <div>
      <FloatingAddButton
        position={btnPosition}
        setPosition={setBtnPosition}
        resetting={resettingBtn}
        onDragStart={() => { }}
        onDragEnd={handleFloatingButtonAction}
        onClick={handleFloatingButtonAction}
      />

      <div className="flex flex-col gap-4 mt-8">
        {(!days || days.length === 0) ? (
          <div className="text-center text-gray-400 py-8">
            <div className="text-lg sm:text-xl md:text-2xl font-semibold mb-2">
              No expense records found for this period.
            </div>
            <div className="text-base sm:text-lg md:text-xl">
              Start tracking your spending to gain valuable insights and better manage your finances.
            </div>
          </div>
        ) : (
          days.map(day => (
            <div
              key={day.date}
              ref={el => { cardRefs.current[day.date] = el; }}
              id={day.date}
            >
              <ExpenseDayCard
                day={day}
                refetch={refetch}
                onDropAdd={() => { }}
              />
            </div>
          ))
        )}
      </div>

      <AddExpenseModal
        open={modalOpen}
        date={modalDate}
        onClose={handleModalClose}
        onSubmit={handleModalSubmit}
      />
    </div>
  );
}