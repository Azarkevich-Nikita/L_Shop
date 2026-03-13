import { useEffect, useState } from "react";
import Button from "../Button";

interface BasketItem {
  product_id: number;
  quantity: number;
  price: number;
  weight: number;
}

interface Basket {
  user_id: number;
  items: BasketItem[];
  deliveryPrice?: number;
  deliveryType?: "pickup" | "courier";
  postalCode?: string;
  address?: string;
}

function Cart() {
  const [basket, setBasket] = useState<Basket | null>(null);
  const [total, setTotal] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBasket = async () => {
      setLoading(true);
      setError(null);
      try {
        const [basketRes, totalRes] = await Promise.all([
          fetch("/api/basket", { credentials: "include" }),
          fetch("/api/basket/price", { credentials: "include" }),
        ]);

        const basketData = await basketRes.json().catch(() => null);
        const totalData = await totalRes.json().catch(() => null);

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

    fetchBasket();
  }, []);

  if (loading) {
    return <span>Загрузка корзины...</span>;
  }

  if (error) {
    return <span style={{ color: "red" }}>{error}</span>;
  }

  if (!basket || basket.items.length === 0) {
    return <span>Корзина пуста.</span>;
  }

  return (
    <div style={{ padding: "1rem" }}>
      <h1>Корзина</h1>
      <ul>
        {basket.items.map((item) => (
          <li key={item.product_id}>
            Товар #{item.product_id}: {item.quantity} шт. × {item.price}₽
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

      <div style={{ marginTop: "1rem" }}>
        <Button
          variant="primary"
          size="m"
          onClick={() => {
            window.location.href = "/delivery";
          }}
        >
          Изменить доставку
        </Button>
      </div>
    </div>
  );
}

export default Cart;