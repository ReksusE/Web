# Vladimir Savchenko

## 📞 Contact Information
- **Phone:** +375 (29) 373-61-57
- **Email:** vova-savchenko-06@mail.ru
- **GitHub:** [ReksusE](https://github.com/ReksusE)
- **Instagram:** [vovasavchenko55](https://www.instagram.com/vovasavchenko55/)
- **Facebook:** [Vladimir Savchenko](https://www.facebook.com/profile.php?id=100031301180303)

## 👨‍💻 About Me
The ability to work in a multitasking mode and high analytical abilities allow me to work effectively with large amounts of information and quickly find high-quality solutions to complex problems.

## 🛠️ Technical Skills
- **Languages:** C#, HTML5, CSS, JavaScript (basics)
- **Tools & methods:** Git/GitHub, Enterprise Architect, Multisim
- **In progress:** Course project in web programming, Coursework on databases

## 📁 Learning Projects
1. **Curriculum Vitae (this page)** – CV in Markdown format
2. **Weather dashboard** – React + OpenWeatherMap API, geolocation
3. **Task manager (CLI)** – Python, sqlite3, argparse
4. **Portfolio layout** – pure HTML/CSS with grid and flex

## 📜 Courses & Certificates
- The Complete Web Development Bootcamp (2024) – Udemy (Angela Yu)
- CS50's Introduction to Computer Science – Harvard edX (2023)
- Frontend Masters: React with TypeScript (2024)
- SQL and Database Design – Stepik (2023)
- freeCodeCamp: Responsive Web Design

## 🧩 Code Example (C#)
```csharp
static void FindMinMaxPrice()
{
    Console.Clear();
    Console.WriteLine("=== ПОИСК ПО ЦЕНЕ ===\n");
    
    if (coffeeArray.Length == 0)
    {
        Console.WriteLine("Каталог пуст.");
        return;
    }
    
    Console.WriteLine("1. Самый дорогой кофе");
    Console.WriteLine("2. Самый дешевый кофе");
    Console.Write("Выберите вариант: ");
    
    string choice = Console.ReadLine();
    
    Coffee result;
    if (choice == "1")
    {
        result = coffeeArray.OrderByDescending(c => c.Price).First();
        Console.WriteLine("\nСАМЫЙ ДОРОГОЙ КОФЕ:");
    }
    else if (choice == "2")
    {
        result = coffeeArray.OrderBy(c => c.Price).First();
        Console.WriteLine("\nСАМЫЙ ДЕШЕВЫЙ КОФЕ:");
    }
    else
    {
        Console.WriteLine("Неверный выбор.");
        return;
    }
    
    Console.WriteLine($"Название: {result.Name}, Цена: {result.Price} руб.");

## 📜 Courses & Certificates
- The Complete Web Development Bootcamp (2024) – Udemy (Angela Yu)
- CS50's Introduction to Computer Science – Harvard edX (2023)
- Frontend Masters: React with TypeScript (2024)
- SQL and Database Design – Stepik (2023)
- freeCodeCamp: Responsive Web Design
