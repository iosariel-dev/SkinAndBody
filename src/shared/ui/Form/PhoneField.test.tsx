import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";

import { PhoneField } from "./Form";

describe("PhoneField", () => {
	it("рендерит label и tel-инпут", () => {
		render(<PhoneField value="" onChange={() => {}} />);
		expect(screen.getByLabelText("Телефон")).toBeInTheDocument();
		expect(screen.getByLabelText("Телефон")).toHaveAttribute("type", "tel");
	});

	it("форматирует ввод через formatPhone и прокидывает в onChange", () => {
		const onChange = vi.fn();
		render(<PhoneField value="" onChange={onChange} />);
		fireEvent.change(screen.getByLabelText("Телефон"), {
			target: { value: "9991234567" },
		});
		expect(onChange).toHaveBeenCalledWith("+7 (999) 123-45-67");
	});

	it("показывает подсказку при error", () => {
		render(<PhoneField value="" onChange={() => {}} error hint="Нужен телефон" />);
		expect(screen.getByText("Нужен телефон")).toBeInTheDocument();
	});
});
