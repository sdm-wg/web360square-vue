import { shallowMount } from "@vue/test-utils";
import moment from "moment";
import CarouselCardEventDate from ".";

describe("molecules/CarouselCardEventDate", () => {
  it("checks props.date", () => {
    // Generate a random string
    const date = Math.random()
      .toString(36)
      .substring(2, 15);
    const wrapper = shallowMount(CarouselCardEventDate, {
      propsData: { date: date },
    });
    expect(wrapper.props("date")).toBe(date);
  });

  it("checks `formattedDate` (computed function)", async () => {
    const wrapper = shallowMount(CarouselCardEventDate);
    const date1 = "2020-08-01T16:00:00.000+09:00";
    wrapper.setProps({ date: date1 });
    await wrapper.vm.$nextTick();
    expect(wrapper.find("span").text()).toBe(
      moment(Date.parse(date1)).format("YYYY-MM-DD HH:mm:SS")
    );

    const date2 = "1970-01-01T00:00:00.000";
    wrapper.setProps({ date: date2 });
    await wrapper.vm.$nextTick();
    expect(wrapper.find("span").text()).toBe(
      moment(Date.parse(date2)).format("YYYY-MM-DD HH:mm:SS")
    );
  });
});
