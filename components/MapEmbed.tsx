// components/MapEmbed.tsx
const MapEmbed = () => {
  return (
    <div className="w-full h-[400px]">
      <iframe
        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3960.3463994889207!2d109.1500939740161!3d-6.968398693032208!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e6fbf6b28cbdadf%3A0x688844e2adb455f3!2sJIMS%20HONEY%20by%20Dya%20Official!5e0!3m2!1sid!2sid!4v1750531088748!5m2!1sid!2sid"
        width="100%"
        height="400"
        className="border-0"
        allowFullScreen
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
      ></iframe>
    </div>
  );
};

export default MapEmbed;
