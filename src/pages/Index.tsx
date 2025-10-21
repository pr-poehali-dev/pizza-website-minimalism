import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import Icon from '@/components/ui/icon';

type PizzaSize = 300 | 500 | 700;

interface Pizza {
  id: number;
  name: string;
  description: string;
  basePrice: number;
  image: string;
  category: string;
}

interface CartItem {
  id: number;
  name: string;
  description: string;
  basePrice: number;
  image: string;
  category: string;
  size: PizzaSize;
  quantity: number;
}

const pizzas: Pizza[] = [
  { id: 1, name: 'Маргарита', description: 'Моцарелла, томатный соус, базилик', basePrice: 450, image: 'https://cdn.poehali.dev/projects/37bd550a-c89d-4300-bba8-c63b6b5e04b3/files/9a25869d-22d4-4a30-b6ef-16f2d4fb5b04.jpg', category: 'Классические' },
  { id: 2, name: 'Пепперони', description: 'Пепперони, моцарелла, томатный соус', basePrice: 550, image: 'https://cdn.poehali.dev/projects/37bd550a-c89d-4300-bba8-c63b6b5e04b3/files/21062f15-d6c0-46cf-9380-31a4e6656a16.jpg', category: 'Мясные' },
  { id: 3, name: 'Четыре сыра', description: 'Моцарелла, пармезан, горгонзола, дор блю', basePrice: 600, image: 'https://cdn.poehali.dev/projects/37bd550a-c89d-4300-bba8-c63b6b5e04b3/files/1e0cfe5c-4fb6-453a-bbda-938308895771.jpg', category: 'Классические' },
  { id: 4, name: 'Мясная', description: 'Говядина, курица, бекон, моцарелла', basePrice: 650, image: 'https://cdn.poehali.dev/projects/37bd550a-c89d-4300-bba8-c63b6b5e04b3/files/9d4967f0-7760-4dfb-9b06-c139599fc2ad.jpg', category: 'Мясные' },
  { id: 5, name: 'Вегетарианская', description: 'Шампиньоны, перец, помидоры, оливки', basePrice: 500, image: 'https://cdn.poehali.dev/projects/37bd550a-c89d-4300-bba8-c63b6b5e04b3/files/b0e32e81-2618-4462-a0fc-88f76c792a7a.jpg', category: 'Вегетарианские' },
  { id: 6, name: 'Гавайская', description: 'Курица, ананасы, моцарелла', basePrice: 580, image: 'https://cdn.poehali.dev/projects/37bd550a-c89d-4300-bba8-c63b6b5e04b3/files/d71fd913-d306-4912-b10a-d52f5686612e.jpg', category: 'Специальные' },
];

const sizeMultipliers: Record<PizzaSize, number> = {
  300: 0.7,
  500: 1.0,
  700: 1.4,
};

const calculatePrice = (basePrice: number, size: PizzaSize): number => {
  return Math.round(basePrice * sizeMultipliers[size]);
};

const promos = [
  { id: 1, title: 'Две пиццы по цене одной', description: 'Каждый понедельник', discount: '50%' },
  { id: 2, title: 'Бесплатная доставка', description: 'При заказе от 1000₽', discount: '0₽' },
  { id: 3, title: 'Комбо набор', description: 'Пицца + напиток + десерт', discount: '-30%' },
];

export default function Index() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [selectedSizes, setSelectedSizes] = useState<Record<number, PizzaSize>>({});
  const { toast } = useToast();
  const phoneNumber = '+79998887766';

  const copyPhoneNumber = () => {
    navigator.clipboard.writeText(phoneNumber);
    toast({
      title: 'Скопировано!',
      description: 'Номер телефона скопирован в буфер обмена',
    });
  };

  const addToCart = (pizza: Pizza, size: PizzaSize) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === pizza.id && item.size === size);
      if (existing) {
        return prev.map(item =>
          item.id === pizza.id && item.size === size ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { ...pizza, size, quantity: 1 }];
    });
  };

  const removeFromCart = (id: number, size: PizzaSize) => {
    setCart(prev => prev.filter(item => !(item.id === id && item.size === size)));
  };

  const updateQuantity = (id: number, size: PizzaSize, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(id, size);
      return;
    }
    setCart(prev =>
      prev.map(item => (item.id === id && item.size === size ? { ...item, quantity } : item))
    );
  };

  const totalPrice = cart.reduce((sum, item) => sum + calculatePrice(item.basePrice, item.size) * item.quantity, 0);
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b">
        <nav className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img src="https://cdn.poehali.dev/files/426146f0-6897-481f-946d-fd60b1c5301d.jpg" alt="Francesco Logo" className="h-12 w-12 object-contain" />
              <h1 className="text-2xl font-bold text-secondary">Francesco</h1>
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
                        {cart.map((item, index) => (
                          <div key={`${item.id}-${item.size}-${index}`} className="flex items-center gap-4 p-4 border rounded-lg">
                            <img src={item.image} alt={item.name} className="w-16 h-16 object-cover rounded" />
                            <div className="flex-1">
                              <h4 className="font-semibold">{item.name}</h4>
                              <p className="text-xs text-muted-foreground">{item.size}г</p>
                              <p className="text-sm font-semibold text-primary">{calculatePrice(item.basePrice, item.size)}₽</p>
                            </div>
                            <div className="flex items-center gap-2">
                              <Button
                                size="icon"
                                variant="outline"
                                className="h-8 w-8"
                                onClick={() => updateQuantity(item.id, item.size, item.quantity - 1)}
                              >
                                <Icon name="Minus" size={14} />
                              </Button>
                              <span className="w-8 text-center">{item.quantity}</span>
                              <Button
                                size="icon"
                                variant="outline"
                                className="h-8 w-8"
                                onClick={() => updateQuantity(item.id, item.size, item.quantity + 1)}
                              >
                                <Icon name="Plus" size={14} />
                              </Button>
                            </div>
                            <Button
                              size="icon"
                              variant="ghost"
                              onClick={() => removeFromCart(item.id, item.size)}
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
              <p className="text-xl text-muted-foreground mb-8">*Какойто текст*</p>
              <div className="flex flex-wrap gap-4 justify-center">
                <Button size="lg" className="text-lg px-8" onClick={() => document.getElementById('menu')?.scrollIntoView({ behavior: 'smooth' })}>
                  Смотреть меню
                </Button>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button size="lg" variant="outline" className="text-lg px-8">
                      <Icon name="Phone" size={20} className="mr-2" />
                      Позвонить
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                      <DialogTitle>Позвонить нам</DialogTitle>
                      <DialogDescription>
                        Мы работаем ежедневно с 10:00 до 23:00
                      </DialogDescription>
                    </DialogHeader>
                    <div className="flex items-center space-x-2">
                      <div className="grid flex-1 gap-2">
                        <Label htmlFor="phone" className="sr-only">
                          Телефон
                        </Label>
                        <Input
                          id="phone"
                          value={phoneNumber}
                          readOnly
                          className="text-lg font-semibold text-center"
                        />
                      </div>
                      <Button type="button" size="icon" onClick={copyPhoneNumber}>
                        <Icon name="Copy" size={16} />
                      </Button>
                    </div>
                    <div className="flex gap-2">
                      <Button asChild className="flex-1">
                        <a href={`tel:${phoneNumber}`}>
                          <Icon name="Phone" size={16} className="mr-2" />
                          Позвонить
                        </a>
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          </div>
        </section>

        <section id="menu" className="py-16">
          <div className="container mx-auto px-4">
            <h2 className="text-4xl font-bold text-center mb-12">Меню</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {pizzas.map((pizza, index) => {
                const selectedSize = selectedSizes[pizza.id] || 500;
                
                return (
                  <Card key={pizza.id} className="hover:shadow-lg transition-shadow animate-scale-in overflow-hidden" style={{ animationDelay: `${index * 0.1}s` }}>
                    <div className="aspect-square w-full overflow-hidden">
                      <img src={pizza.image} alt={pizza.name} className="w-full h-full object-cover hover:scale-105 transition-transform duration-300" />
                    </div>
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <CardTitle>{pizza.name}</CardTitle>
                        <Badge variant="secondary">{pizza.category}</Badge>
                      </div>
                      <CardDescription className="mt-2">{pizza.description}</CardDescription>
                      
                      <div className="mt-4 space-y-2">
                        <Label className="text-xs font-semibold">Размер:</Label>
                        <div className="flex gap-2">
                          {([300, 500, 700] as PizzaSize[]).map(size => (
                            <button
                              key={size}
                              onClick={() => setSelectedSizes(prev => ({ ...prev, [pizza.id]: size }))}
                              className={`flex-1 px-3 py-2 text-sm rounded-md border-2 transition-colors ${
                                selectedSize === size
                                  ? 'border-primary bg-primary text-primary-foreground'
                                  : 'border-muted hover:border-primary/50'
                              }`}
                            >
                              {size}г
                            </button>
                          ))}
                        </div>
                      </div>
                    </CardHeader>
                    <CardFooter className="flex justify-between items-center">
                      <span className="text-2xl font-bold">{calculatePrice(pizza.basePrice, selectedSize)}₽</span>
                      <Button onClick={() => addToCart(pizza, selectedSize)}>
                        <Icon name="Plus" size={16} className="mr-2" />
                        В корзину
                      </Button>
                    </CardFooter>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>

        <section id="promos" className="py-16 bg-muted/30">
          <div className="container mx-auto px-4">
            <h2 className="text-4xl font-bold text-center mb-12">Акции
*Примеры акций если они будут*</h2>
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
                <p className="text-muted-foreground">Есть доставка это круто</p>
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
                  <span>Работаем с *время* без выходных</span>
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