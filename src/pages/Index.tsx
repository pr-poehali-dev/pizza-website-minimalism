import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import Icon from '@/components/ui/icon';

interface Pizza {
  id: number;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
}

interface CartItem extends Pizza {
  quantity: number;
}

const pizzas: Pizza[] = [
  { id: 1, name: 'Маргарита', description: 'Моцарелла, томатный соус, базилик', price: 450, image: '🍕', category: 'Классические' },
  { id: 2, name: 'Пепперони', description: 'Пепперони, моцарелла, томатный соус', price: 550, image: '🍕', category: 'Мясные' },
  { id: 3, name: 'Четыре сыра', description: 'Моцарелла, пармезан, горгонзола, дор блю', price: 600, image: '🍕', category: 'Классические' },
  { id: 4, name: 'Мясная', description: 'Говядина, курица, бекон, моцарелла', price: 650, image: '🍕', category: 'Мясные' },
  { id: 5, name: 'Вегетарианская', description: 'Шампиньоны, перец, помидоры, оливки', price: 500, image: '🍕', category: 'Вегетарианские' },
  { id: 6, name: 'Гавайская', description: 'Курица, ананасы, моцарелла', price: 580, image: '🍕', category: 'Специальные' },
];

const promos = [
  { id: 1, title: 'Две пиццы по цене одной', description: 'Каждый понедельник', discount: '50%' },
  { id: 2, title: 'Бесплатная доставка', description: 'При заказе от 1000₽', discount: '0₽' },
  { id: 3, title: 'Комбо набор', description: 'Пицца + напиток + десерт', discount: '-30%' },
];

export default function Index() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [logoImage, setLogoImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const addToCart = (pizza: Pizza) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === pizza.id);
      if (existing) {
        return prev.map(item =>
          item.id === pizza.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { ...pizza, quantity: 1 }];
    });
  };

  const removeFromCart = (id: number) => {
    setCart(prev => prev.filter(item => item.id !== id));
  };

  const updateQuantity = (id: number, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(id);
      return;
    }
    setCart(prev =>
      prev.map(item => (item.id === id ? { ...item, quantity } : item))
    );
  };

  const totalPrice = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b">
        <nav className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageUpload}
              />
              {logoImage ? (
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="relative group cursor-pointer"
                >
                  <img src={logoImage} alt="Logo" className="h-10 w-10 object-cover rounded" />
                  <div className="absolute inset-0 bg-black/50 rounded opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <Icon name="Upload" size={16} className="text-white" />
                  </div>
                </button>
              ) : (
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="h-10 w-10 border-2 border-dashed border-muted-foreground/30 rounded flex items-center justify-center hover:border-primary transition-colors group"
                >
                  <Icon name="Plus" size={20} className="text-muted-foreground group-hover:text-primary" />
                </button>
              )}
              <h1 className="text-2xl text-secondary font-bold">Francesco</h1>
            </div>
            
            <div className="hidden md:flex items-center gap-6">
              <a href="#home" className="hover:text-primary transition-colors">Главная</a>
              <a href="#menu" className="hover:text-primary transition-colors">Меню</a>
              <a href="#promos" className="hover:text-primary transition-colors">Акции</a>
              <a href="#delivery" className="hover:text-primary transition-colors">Доставка</a>
              <a href="#contacts" className="hover:text-primary transition-colors">Контакты</a>
            </div>

            <div className="flex items-center gap-4">
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="outline" size="icon" className="relative">
                    <Icon name="ShoppingCart" size={20} />
                    {cartCount > 0 && (
                      <Badge className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs">
                        {cartCount}
                      </Badge>
                    )}
                  </Button>
                </SheetTrigger>
                <SheetContent className="w-full sm:max-w-lg overflow-y-auto">
                  <SheetHeader>
                    <SheetTitle>Корзина</SheetTitle>
                    <SheetDescription>Ваш заказ</SheetDescription>
                  </SheetHeader>
                  
                  <div className="mt-8 space-y-4">
                    {cart.length === 0 ? (
                      <p className="text-center text-muted-foreground py-8">Корзина пуста</p>
                    ) : (
                      <>
                        {cart.map(item => (
                          <div key={item.id} className="flex items-center gap-4 p-4 border rounded-lg">
                            <span className="text-4xl">{item.image}</span>
                            <div className="flex-1">
                              <h4 className="font-semibold">{item.name}</h4>
                              <p className="text-sm text-muted-foreground">{item.price}₽</p>
                            </div>
                            <div className="flex items-center gap-2">
                              <Button
                                size="icon"
                                variant="outline"
                                className="h-8 w-8"
                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              >
                                <Icon name="Minus" size={14} />
                              </Button>
                              <span className="w-8 text-center">{item.quantity}</span>
                              <Button
                                size="icon"
                                variant="outline"
                                className="h-8 w-8"
                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              >
                                <Icon name="Plus" size={14} />
                              </Button>
                            </div>
                            <Button
                              size="icon"
                              variant="ghost"
                              onClick={() => removeFromCart(item.id)}
                            >
                              <Icon name="Trash2" size={16} />
                            </Button>
                          </div>
                        ))}
                        
                        <Separator className="my-6" />
                        
                        <div className="space-y-4">
                          <div className="flex justify-between text-lg font-semibold">
                            <span>Итого:</span>
                            <span>{totalPrice}₽</span>
                          </div>
                          
                          <div className="space-y-3">
                            <div>
                              <Label htmlFor="name">Имя</Label>
                              <Input id="name" placeholder="Ваше имя" />
                            </div>
                            <div>
                              <Label htmlFor="phone">Телефон</Label>
                              <Input id="phone" type="tel" placeholder="+7 (999) 123-45-67" />
                            </div>
                            <div>
                              <Label htmlFor="address">Адрес доставки</Label>
                              <Input id="address" placeholder="Улица, дом, квартира" />
                            </div>
                          </div>
                          
                          <Button className="w-full" size="lg">
                            Оформить заказ
                          </Button>
                        </div>
                      </>
                    )}
                  </div>
                </SheetContent>
              </Sheet>

              <Button variant="ghost" size="icon" className="md:hidden">
                <Icon name="Menu" size={24} />
              </Button>
            </div>
          </div>
        </nav>
      </header>

      <main>
        <section id="home" className="py-20 bg-gradient-to-b from-primary/5 to-transparent">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center animate-fade-in">
              <h2 className="text-5xl md:text-6xl font-bold mb-6">
                Настоящая итальянская пицца
              </h2>
              <p className="text-xl text-muted-foreground mb-8">
                Приготовлена с любовью из свежих ингредиентов. Доставка за 30 минут или бесплатно!
              </p>
              <div className="flex flex-wrap gap-4 justify-center">
                <Button size="lg" className="text-lg px-8" onClick={() => document.getElementById('menu')?.scrollIntoView({ behavior: 'smooth' })}>
                  Смотреть меню
                </Button>
                <Button size="lg" variant="outline" className="text-lg px-8">
                  <Icon name="Phone" size={20} className="mr-2" />
                  Позвонить
                </Button>
              </div>
            </div>
          </div>
        </section>

        <section id="menu" className="py-16">
          <div className="container mx-auto px-4">
            <h2 className="text-4xl font-bold text-center mb-12">Меню</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {pizzas.map((pizza, index) => (
                <Card key={pizza.id} className="hover:shadow-lg transition-shadow animate-scale-in" style={{ animationDelay: `${index * 0.1}s` }}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle>{pizza.name}</CardTitle>
                        <Badge variant="secondary" className="mt-2">{pizza.category}</Badge>
                      </div>
                      <span className="text-5xl">{pizza.image}</span>
                    </div>
                    <CardDescription className="mt-2">{pizza.description}</CardDescription>
                  </CardHeader>
                  <CardFooter className="flex justify-between items-center">
                    <span className="text-2xl font-bold">{pizza.price}₽</span>
                    <Button onClick={() => addToCart(pizza)}>
                      <Icon name="Plus" size={16} className="mr-2" />
                      В корзину
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section id="promos" className="py-16 bg-muted/30">
          <div className="container mx-auto px-4">
            <h2 className="text-4xl font-bold text-center mb-12">Акции</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {promos.map(promo => (
                <Card key={promo.id} className="border-2 border-primary/20 hover:border-primary transition-colors">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <CardTitle className="text-xl">{promo.title}</CardTitle>
                      <Badge variant="destructive" className="text-lg px-3">{promo.discount}</Badge>
                    </div>
                    <CardDescription className="text-base">{promo.description}</CardDescription>
                  </CardHeader>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section id="delivery" className="py-16">
          <div className="container mx-auto px-4">
            <h2 className="text-4xl font-bold text-center mb-12">Доставка</h2>
            <div className="max-w-3xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
              <div className="space-y-4">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                  <Icon name="Pizza" size={32} className="text-primary" />
                </div>
                <h3 className="text-xl font-semibold">Готовим</h3>
                <p className="text-muted-foreground">Готовим вашу пиццу из свежих ингредиентов</p>
              </div>
              <div className="space-y-4">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                  <Icon name="Truck" size={32} className="text-primary" />
                </div>
                <h3 className="text-xl font-semibold">Доставляем</h3>
                <p className="text-muted-foreground">Доставка до 30 минут по всему городу</p>
              </div>
              <div className="space-y-4">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                  <Icon name="Heart" size={32} className="text-primary" />
                </div>
                <h3 className="text-xl font-semibold">Наслаждайтесь</h3>
                <p className="text-muted-foreground">Горячая пицца прямо к вашему столу</p>
              </div>
            </div>
            <div className="mt-12 max-w-2xl mx-auto bg-primary/5 p-8 rounded-lg">
              <h3 className="text-2xl font-semibold mb-4 text-center">Условия доставки</h3>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <Icon name="Check" size={20} className="text-primary mt-1" />
                  <span>Бесплатная доставка при заказе от 1000₽</span>
                </li>
                <li className="flex items-start gap-3">
                  <Icon name="Check" size={20} className="text-primary mt-1" />
                  <span>Доставка до 30 минут или пицца бесплатно</span>
                </li>
                <li className="flex items-start gap-3">
                  <Icon name="Check" size={20} className="text-primary mt-1" />
                  <span>Работаем с 10:00 до 23:00 без выходных</span>
                </li>
                <li className="flex items-start gap-3">
                  <Icon name="Check" size={20} className="text-primary mt-1" />
                  <span>Минимальная сумма заказа 500₽</span>
                </li>
              </ul>
            </div>
          </div>
        </section>

        <section id="contacts" className="py-16 bg-muted/30">
          <div className="container mx-auto px-4">
            <h2 className="text-4xl font-bold text-center mb-12">Контакты</h2>
            <div className="max-w-2xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Icon name="Phone" size={24} className="text-primary" />
                    Телефон
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-xl font-semibold">+7 (999) 123-45-67</p>
                  <p className="text-sm text-muted-foreground mt-2">Ежедневно с 10:00 до 23:00</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Icon name="MapPin" size={24} className="text-primary" />
                    Адрес
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-xl font-semibold">ул. Пушкина, д. 10</p>
                  <p className="text-sm text-muted-foreground mt-2">Москва, Россия</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Icon name="Mail" size={24} className="text-primary" />
                    Email
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-xl font-semibold">info@pizzeria.ru</p>
                  <p className="text-sm text-muted-foreground mt-2">Ответим в течение часа</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Icon name="Clock" size={24} className="text-primary" />
                    Режим работы
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-xl font-semibold">10:00 - 23:00</p>
                  <p className="text-sm text-muted-foreground mt-2">Без выходных</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-secondary text-white py-8">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <span className="text-3xl">🍕</span>
            <h3 className="text-2xl font-bold">PIZZERIA</h3>
          </div>
          <p className="text-white/80">© 2025 Pizzeria. Все права защищены.</p>
        </div>
      </footer>
    </div>
  );
}