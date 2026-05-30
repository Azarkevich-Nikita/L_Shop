import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../Button";
import type { Basket, BuyRequest, ProductIdRequest, TotalPriceResponse } from "../../types/api";

function Cart() {
  const navigate = useNavigate();
  const [basket, setBasket] = useState<Basket | null>(null);
  const [total, setTotal] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [ordering, setOrdering] = useState(false);

  const loadBasket = async () => {
    setLoading(true);
    setError(null);
    try {
      const [basketRes, totalRes] = await Promise.all([
        fetch("/api/basket", { credentials: "include" }),
        fetch("/api/basket/price", { credentials: "include" }),
      ]);

      if (basketRes.status === 401 || totalRes.status === 401) {
        navigate("/auth");
        setLoading(false);
        return;
      }

      const basketData = await basketRes.json().catch(() => null) as Basket | null;
      const totalData = await totalRes.json().catch(() => null) as TotalPriceResponse | null;

      if (!basketRes.ok) {
        setError(basketData?.error || "Не удалось загрузить корзину");
        setLoading(false);
        return;
      }
      if (!totalRes.ok) {
        setError(totalData?.error || "Не удалось загрузить итоговую сумму");
        setLoading(false);
        return;
      }

      setBasket(basketData || null);
      setTotal(typeof totalData?.total === "number" ? totalData.total : null);
    } catch {
      setError("Не удалось подключиться к серверу. Проверьте, что бэкенд запущен на порту 8080.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadBasket();
  }, []);

  const handleRemove = async (productId: number) => {
    try {
      const body: ProductIdRequest = { productId };
      const res = await fetch("/api/basket", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(body),
      });
      if (res.status === 401) {
        navigate("/auth");
        return;
      }
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        alert(data?.error || "Не удалось удалить товар");
        return;
      }
      await loadBasket();
    } catch {
      alert("Не удалось подключиться к серверу");
    }
  };

  const handleOrder = async () => {
    if (!basket || !basket.items.length) return;
    setOrdering(true);
    try {
      const body: BuyRequest = {
        address: basket.address || "",
        phone: "",
        email: "",
        changeFrom: null,
      };
      const res = await fetch("/api/basket/buy", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(body),
      });
      if (res.status === 401) {
        navigate("/auth");
        return;
      }
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        alert(data?.error || "Не удалось оформить заказ");
        return;
      }
      await loadBasket();
      alert("Заказ оформлен");
    } catch {
      alert("Не удалось подключиться к серверу");
    } finally {
      setOrdering(false);
    }
  };

  if (loading) {
    return <span>Загрузка корзины...</span>;
  }

  if (error) {
    return <span style={{ color: "red" }}>{error}</span>;
  }

  if (!basket || basket.items.length === 0) {
    return (
      <div style={{ padding: "1rem" }}>
        <h1>Корзина</h1>
        <p>Пустая корзина</p>
      </div>
    );
  }

  return (
    <div style={{ padding: "1rem" }}>
      <h1>Корзина</h1>
      <ul>
        {basket.items.map((item) => (
          <li key={item.product_id} style={{ display: "flex", gap: "8px", alignItems: "center" }}>
            <span>
              Товар #{item.product_id}: {item.quantity} шт. × {item.price}₽
            </span>
            <Button
              variant="stroke"
              size="s"
              onClick={() => handleRemove(item.product_id)}
            >
              Удалить
            </Button>
          </li>
        ))}
      </ul>

      {basket.deliveryType && (
        <div style={{ marginTop: "1rem" }}>
          <h2>Доставка</h2>
          <p>Тип: {basket.deliveryType === "courier" ? "Курьер" : "Самовывоз"}</p>
          {basket.deliveryType === "courier" && (
            <>
              {basket.address && <p>Адрес: {basket.address}</p>}
              {basket.postalCode && <p>Почтовый индекс: {basket.postalCode}</p>}
            </>
          )}
          {typeof basket.deliveryPrice === "number" && (
            <p>Стоимость доставки: {basket.deliveryPrice}₽</p>
          )}
        </div>
      )}

      {typeof total === "number" && (
        <h2 style={{ marginTop: "1rem" }}>Итого: {total}₽</h2>
      )}

      <div style={{ marginTop: "1rem", display: "flex", gap: "8px" }}>
        <Button
          variant="stroke"
          size="m"
          onClick={() => {
            navigate("/delivery");
          }}
        >
          Изменить доставку
        </Button>
        <Button
          variant="primary"
          size="m"
          onClick={handleOrder}
          disabled={ordering}
        >
          {ordering ? "Оформляем..." : "Заказать"}
        </Button>
      </div>
    </div>
  );
}

export default Cart;
