import { describe, it, expect } from "vitest";

import { getServiceMinPrice, getServiceFromPrice, consultations } from "./index";

describe("getServiceMinPrice (единый источник цен)", () => {
	it("возвращает минимальную цену по всем тарифам услуги", () => {
		expect(getServiceMinPrice("epilation")).toBe(600);
		expect(getServiceMinPrice("depilation")).toBe(250);
		expect(getServiceMinPrice("rflifting")).toBe(2000);
	});

	it("несуществующая услуга → null", () => {
		expect(getServiceMinPrice("net-takoy-uslugi")).toBeNull();
	});
});

describe("getServiceFromPrice (сводка «от X ₽»)", () => {
	it("форматирует с обычным пробелом-разделителем тысяч", () => {
		expect(getServiceFromPrice("epilation")).toBe("от 600 ₽");
		expect(getServiceFromPrice("rflifting")).toBe("от 2 000 ₽");
	});

	it("несуществующая услуга → пустая строка", () => {
		expect(getServiceFromPrice("net-takoy-uslugi")).toBe("");
	});

	it("депиляция выводится из прайса (250), а не из устаревшего хардкода (300)", () => {
		expect(getServiceFromPrice("depilation")).toBe("от 250 ₽");
	});
});

describe("consultations (единый источник цен консультаций)", () => {
	it("содержит цену и длительность обоих типов", () => {
		expect(consultations.general.price).toBe("500 ₽");
		expect(consultations.general.duration).toBe("30 мин");
		expect(consultations.acne.price).toBe("1 500 ₽");
		expect(consultations.acne.duration).toBe("45-60 мин");
	});
});
