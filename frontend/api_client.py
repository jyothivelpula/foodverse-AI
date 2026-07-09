"""HTTP client for the FoodVerse AI backend API."""

from __future__ import annotations

from typing import Any

import requests

from config import API_BASE_URL, CHAT_TIMEOUT, REQUEST_TIMEOUT


class ApiClient:
    def __init__(self, base_url: str = API_BASE_URL, timeout: int = REQUEST_TIMEOUT) -> None:
        self.base_url = base_url.rstrip("/")
        self.timeout = timeout
        self.chat_timeout = CHAT_TIMEOUT

    def _url(self, path: str) -> str:
        return f"{self.base_url}/{path.lstrip('/')}"

    def health(self) -> dict[str, Any]:
        response = requests.get(self._url("/health"), timeout=self.timeout)
        response.raise_for_status()
        return response.json()

    def get_menu(self) -> list[dict[str, Any]]:
        response = requests.get(self._url("/menu"), timeout=self.timeout)
        response.raise_for_status()
        return response.json()

    def get_categories(self) -> list[dict[str, Any]]:
        response = requests.get(self._url("/categories"), timeout=self.timeout)
        response.raise_for_status()
        return response.json()

    def create_order(self, payload: dict[str, Any]) -> dict[str, Any]:
        response = requests.post(self._url("/orders"), json=payload, timeout=self.timeout)
        response.raise_for_status()
        return response.json()

    def get_order(self, order_id: str) -> dict[str, Any]:
        response = requests.get(self._url(f"/orders/{order_id}"), timeout=self.timeout)
        response.raise_for_status()
        return response.json()

    def get_personas(self) -> list[dict[str, Any]]:
        response = requests.get(self._url("/personas"), timeout=self.timeout)
        response.raise_for_status()
        return response.json()

    def send_chat_message(self, payload: dict[str, Any]) -> dict[str, Any]:
        response = requests.post(self._url("/chat"), json=payload, timeout=self.chat_timeout)
        if not response.ok:
            detail = ""
            try:
                detail = response.json().get("detail", response.text)
            except Exception:  # noqa: BLE001
                detail = response.text
            raise RuntimeError(detail or f"Chat failed ({response.status_code})")
        return response.json()

    def create_review(self, payload: dict[str, Any]) -> dict[str, Any]:
        response = requests.post(self._url("/reviews"), json=payload, timeout=self.timeout)
        response.raise_for_status()
        return response.json()


api_client = ApiClient()
