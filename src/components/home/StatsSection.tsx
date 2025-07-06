import { Droplet, Users, MapPin, Heart } from 'lucide-react';

const StatsSection = () => {
  const stats = [
    {
      icon: <Droplet className="w-8 h-8 text-white" />,
      value: "10,000+",
      label: "Donations",
      color: "bg-primary"
    },
    {
      icon: <Users className="w-8 h-8 text-white" />,
      value: "5,000+",
      label: "Registered Donors",
      color: "bg-primary-dark"
    },
    {
      icon: <MapPin className="w-8 h-8 text-white" />,
      value: "64",
      label: "Districts Covered",
      color: "bg-primary"
    },
    {
      icon: <Heart className="w-8 h-8 text-white" />,
      value: "15,000+",
      label: "Lives Saved",
      color: "bg-primary-dark"
    }
  ];

  return (
    <section className="py-20 bg-white">
      <div className="container-custom">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <div key={index} className="card overflow-hidden flex flex-col h-full transform transition-all duration-300 hover:scale-105">
              <div className={`${stat.color} p-4 flex justify-center`}>
                {stat.icon}
              </div>
              <div className="p-6 text-center">
                <h3 className="text-3xl font-bold mb-2">{stat.value}</h3>
                <p className="text-gray-600">{stat.label}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatsSection;