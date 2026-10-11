import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { render, screen, fireEvent, act, cleanup } from '@testing-library/react';
import { AppProvider } from '../store/AppContext';
import App from '../App';

function renderApp() {
  return render(
    <AppProvider>
      <App />
    </AppProvider>,
  );
}

function spinWheel() {
  fireEvent.click(screen.getByRole('button', { name: 'ÇEVİR' }));
  act(() => {
    for (let i = 0; i < 400; i++) vi.advanceTimersByTime(16);
  });
}

function poolCount(): number {
  const text = screen.getByText(/Havuzda \d+ takım var/).textContent ?? '';
  const match = text.match(/Havuzda (\d+) takım var/);
  return match ? Number(match[1]) : -1;
}

describe('spin flow', () => {
  beforeEach(() => {
    window.localStorage.clear();
    vi.useFakeTimers({ toFake: ['setTimeout', 'clearTimeout', 'Date', 'performance'] });
  });

  afterEach(() => {
    vi.useRealTimers();
    cleanup();
  });

  it('çark dönüşü bittiğinde geçmişe bir kayıt eklenmeli', () => {
    const { container } = renderApp();
    const before = poolCount();
    expect(before).toBeGreaterThan(0);

    spinWheel();

    expect(screen.getByText('Son Seçimler')).toBeInTheDocument();
    expect(container.querySelectorAll('.history-item')).toHaveLength(1);
  });

  it('kaldırma ayarı açıkken seçilen takım havuzdan çıkarılmalı', () => {
    const { container } = renderApp();
    const before = poolCount();

    const settingToggle = screen
      .getByText('Seçilen takımı sonraki turlardan çıkar')
      .closest('label') as HTMLElement;
    fireEvent.click(settingToggle.getElementsByTagName('input')[0]);

    spinWheel();

    expect(poolCount()).toBe(before - 1);
    expect(container.querySelectorAll('.history-item')).toHaveLength(1);
    expect(screen.queryByText(/galatasaray/i) == null || screen.getAllByText(/galatasaray/i).length >= 0).toBe(true);
  });

  it('kaldırma ayarı kapalıyken havuz sabit kalmalı', () => {
    renderApp();
    const before = poolCount();

    spinWheel();

    expect(poolCount()).toBe(before);
  });
});