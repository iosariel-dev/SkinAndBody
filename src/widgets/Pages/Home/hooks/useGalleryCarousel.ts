"use client";

import { useCallback, useEffect, useRef, useState } from "react";

/**
 * Бесконечная карусель галереи: реальные страницы лежат на индексах 1..N,
 * клоны на 0 и N+1. После перехода на клон делаем мгновенный «снап» (без
 * transition) на реальный эквивалент, чтобы листание продолжалось циклично.
 * Плюс touch-свайп для мобилы.
 */
export function useGalleryCarousel(pageCount: number) {
	// Infinite carousel: render [last_clone, ...pages, first_clone].
	const [slideIdx, setSlideIdx] = useState(1);
	const [withTransition, setWithTransition] = useState(true);

	const activeGalleryPage =
		(((slideIdx - 1) % pageCount) + pageCount) % pageCount;

	const galleryPrev = useCallback(() => {
		setWithTransition(true);
		setSlideIdx((i) => Math.max(0, i - 1));
	}, []);
	const galleryNext = useCallback(() => {
		setWithTransition(true);
		setSlideIdx((i) => Math.min(pageCount + 1, i + 1));
	}, [pageCount]);
	const goToGalleryPage = useCallback((page: number) => {
		setWithTransition(true);
		setSlideIdx(page + 1);
	}, []);

	// After transitioning onto a clone slide, jump (without transition)
	// to the real equivalent so the next move continues cyclically.
	const handleTrackTransitionEnd = useCallback(
		(e: React.TransitionEvent<HTMLDivElement>) => {
			if (e.target !== e.currentTarget || e.propertyName !== "transform") return;
			if (slideIdx === pageCount + 1) {
				setWithTransition(false);
				setSlideIdx(1);
			} else if (slideIdx === 0) {
				setWithTransition(false);
				setSlideIdx(pageCount);
			}
		},
		[slideIdx, pageCount],
	);

	// Re-enable transition on the frame after a snap.
	useEffect(() => {
		if (withTransition) return;
		const id = requestAnimationFrame(() => {
			requestAnimationFrame(() => setWithTransition(true));
		});
		return () => cancelAnimationFrame(id);
	}, [withTransition]);

	// Touch swipe support (mobile).
	const touchRef = useRef<{ x: number; dx: number; active: boolean }>({
		x: 0,
		dx: 0,
		active: false,
	});
	const onGalleryTouchStart = useCallback((e: React.TouchEvent) => {
		touchRef.current = { x: e.touches[0].clientX, dx: 0, active: true };
	}, []);
	const onGalleryTouchMove = useCallback((e: React.TouchEvent) => {
		if (!touchRef.current.active) return;
		touchRef.current.dx = e.touches[0].clientX - touchRef.current.x;
	}, []);
	const onGalleryTouchEnd = useCallback(() => {
		if (!touchRef.current.active) return;
		const { dx } = touchRef.current;
		touchRef.current.active = false;
		const THRESHOLD = 50;
		if (dx <= -THRESHOLD) galleryNext();
		else if (dx >= THRESHOLD) galleryPrev();
	}, [galleryNext, galleryPrev]);

	return {
		slideIdx,
		withTransition,
		activeGalleryPage,
		galleryPrev,
		galleryNext,
		goToGalleryPage,
		handleTrackTransitionEnd,
		onGalleryTouchStart,
		onGalleryTouchMove,
		onGalleryTouchEnd,
	};
}
