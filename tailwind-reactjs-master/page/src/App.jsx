import { useState } from 'react';
import './App.css';

import Header from './component/Header';
import Home from './component/Home.jsx';
import Clients from './component/Clients.jsx';
import Community from './component/Community.jsx';
import Achievements from './component/Achievements.jsx';
import Body from './component/Body.jsx';
import Updates from './component/Updates.jsx';
import Footer from './component/Footer.jsx';
import End from './component/End.jsx'
import logos from './assets/logos.js';


function App() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [showMenu, setShowMenu] = useState(false);

  const slides = [
    {
      title: 'Lessons and insights',
      highlight: 'from 8 years',
      desc: 'Where to grow your business as a photographer: site or social media?',
      image: 'src/img/illustration.png',
      buttonText: 'Register',
      reverse: false,
      bgColor: 'bg-teal-50'
    },
    {
      title: 'The unseen of spending three years at Pixelgrade',
      desc: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit...',
      image: 'src/img/rafiki.png',
      buttonText: 'Learn More',
      reverse: true,
      bgColor: 'bg-white',
    },
    {
      title: 'How to design your site footer like we did',
      desc: 'Donec a eros justo. Fusce egestas tristique ultrices...',
      image: 'src/img/pana.png',
      buttonText: 'Learn More',
      reverse: true,
      bgColor: 'bg-white',
    }
  ];
  const stats = [
    { icon: 'src/img/member.svg', value: '2,245,341', label: 'Members' },
    { icon: 'src/img/club.svg', value: '46,328', label: 'Clubs' },
    { icon: 'src/img/booking.svg', value: '828,867', label: 'Event Bookings' },
    { icon: 'src/img/payment.svg', value: '1,926,436', label: 'Payments' }
  ];

  const posts = [
    {
      image: 'src/img/frame1.png',
      text: 'Creating Streamlined Safeguarding Processes with OneRen',
    },
    {
      image: 'src/img/frame2.png',
      text: 'What are your safeguarding responsibilities and how can you manage them?',
    },
    {
      image: 'src/img/frame3.png',
      text: 'Revamping the Membership Model with Triathlon Australia',
    }
  ];

  const communityItems = [
    {
      icon: 'src/img/membership.svg',
      title: 'Clubs',
      description: 'Clubs for different interests and activities',
    },
    {
      icon: 'src/img/national.svg',
      title: 'Groups',
      description: 'Connect with people who share your passion',
    },
    {
      icon: 'src/img/club-group.svg',
      title: 'Events',
      description: 'Plan and attend events in your area',
    }
  ];
  const socialItems = [
  { title: 'Instagram', icon: 'src/img/instagram.svg' },
  { title: 'Ball', icon: 'src/img/ball.svg' },
  { title: 'Twitter', icon: 'src/img/twitter.svg' },
  { title: 'Youtube', icon: 'src/img/youtube.svg' },
  ];

  return (
    <>
      <Header showMenu={showMenu} setShowMenu={setShowMenu} />
      <Home slides={slides} activeIndex={activeIndex} setActiveIndex={setActiveIndex} />
      <Clients 
      image="src/img/LogoT.jpg"
      logos={logos} />
      <Community items={communityItems} />
      <Achievements stats={stats} title="Helping a local" subtitle="business reinvent itself" />
      <Body
        image="src/img/LogoT.jpg"
        paragraph="We reached here with our hard work and dedication. The team at Nextcent really helped us improve our processes and reach our community better."
        author="Tim Smith"
        position="British Dragon Boat Racing Association"
        logos={logos}
      />
      <Updates
        title="Caring is the new marketing"
        description="The Nextcent blog is the best place to read about the latest membership insights, trends and more. See who's joining the community, read about how our community are increasing their membership income and lot's more.​"
        posts={posts}
      />
      <Footer
        title="Pellentesque suscipit fringilla libero eu."
        buttonText="Get a Demo"
      />
      <End items={socialItems} />
    </>
  );
}

export default App;
