import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { AppProvider } from './store/AppContext';
import { allTeams } from './data';
import App from './App';

function renderApp() {
  return render(
    <AppProvider>
      <App />
    </AppProvider>,
  );
}

describe('App', () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it('başlık ve çevir butonu render edilmeli', () => {
    renderApp();
    expect(screen.getByText('FIFA Takım Çarkı')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'ÇEVİR' })).toBeInTheDocument();
  });

  it('11 kategori filtresi mevcut olmalı', () => {
    renderApp();
    const rows = screen.getAllByRole('checkbox');
    expect(rows.length).toBeGreaterThanOrEqual(11);
  });

  it('Tümünü Temizle sonrası havuz boşalmalı ve çevir kilitlenmeli', () => {
    renderApp();
    fireEvent.click(screen.getByRole('button', { name: 'Tümünü Temizle' }));
    expect(screen.getByText('Havuzda 0 takım var')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'ÇEVİR' })).toBeDisabled();
  });

  it('Tümünü Seç sonrası tüm takımlar havuza eklenmeli', () => {
    renderApp();
    fireEvent.click(screen.getByRole('button', { name: 'Tümünü Temizle' }));
    fireEvent.click(screen.getByRole('button', { name: 'Tümünü Seç' }));
    expect(screen.getByText(`Havuzda ${allTeams.length} takım var`)).toBeInTheDocument();
  });

  it('değişiklikler localStorage ile kalıcı olmalı', async () => {
    const first = renderApp();
    fireEvent.click(first.getByRole('button', { name: 'Tümünü Temizle' }));
    expect(first.getByText('Havuzda 0 takım var')).toBeInTheDocument();
    first.unmount();

    const second = renderApp();
    expect(second.getByText('Havuzda 0 takım var')).toBeInTheDocument();
    expect(second.getByRole('button', { name: 'ÇEVİR' })).toBeDisabled();
    second.unmount();
  });
});