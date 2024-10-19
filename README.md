# Automating the name tag design process

Conferences, case comps, and hackathons make up the highlights of many student's time in universities. Why? Because they combine hands-on learning, creativity, teamwork, networking, and the thrill of solving real-world challenges in a lively, collaborative environment. These events are especially rewarding for the organizing team, who get to see the fruits of their labour play out in real time.

Do you know whats not fun about these events? **Designing nametags**. See, professional delegates always wear nametags telling you who they are, what company they're from, and why they're there. These don't appear out of thin air - designers and marketing students alike are the force behind these designs and let me tell you - it can take **hours** to compile all of these designs together. But what if they could do it all at the click of a button?

## Meet BizTag

BizTag is a powerful Figma plugin that is built by a designer, for designers. The app communicates with [Figma's Plugin API](https://www.figma.com/plugin-docs/api/api-reference/) to build a series of clean, customizable, and organized name tags.

All it takes is a background image with a resolution of your choosing, and a .json file populated with information on your event partners, and you can complete 2 hours worth of work with a single click. The plugin automatically places name, company, and pronouns on the frontside, and generates a QR code using the [QR code api](https://goqr.me/api/) to place on the backside.

## Schema

The schema follows this format:

```
type Partner = {
  firstname: string;
  lastname: string;
  position: string;
  pronouns: string;
  linkedin: string;
};

type PartnerList = Partner[];
```

where the .json file should be formatted as a single PartnerList object.

## Demo

https://github.com/user-attachments/assets/8a5935e5-8d2e-46f9-b739-cdb6e18b56f7

## Credits

Plugin compatibility with React by [figma-plugin-react-template](https://github.com/nirsky/figma-plugin-react-template).

## Notes

This project was made for [UBC BizTech](https://www.ubcbiztech.com/) by myself, a 2024/25 Design Director.
