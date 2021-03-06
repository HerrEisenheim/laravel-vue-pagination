import { mount } from '@vue/test-utils'
import LaravelVuePagination from '@/LaravelVuePagination.vue';

function getComponent(Component, propsData) {
    const wrapper = mount(Component, { propsData: propsData });
    return wrapper;
}

var exampleData = {
    current_page: 1,
    data: [
        { id: 1 },
        { id: 2 },
        { id: 3 },
        { id: 4 },
        { id: 5 },
        { id: 6 },
        { id: 7 },
        { id: 8 },
        { id: 9 },
        { id: 10 },
        { id: 11 },
    ],
    from: 1,
    last_page: 6,
    next_page_url: 'http://example.com/page/2',
    per_page: 2,
    prev_page_url: null,
    to: 3,
    total: 11,
};

describe('LaravelVuePagination', function() {
    it('has correct DOM structure', function() {
        const wrapper = getComponent(LaravelVuePagination, {
            data: exampleData
        });

        expect(wrapper.contains('ul')).toBe(true);
        expect(wrapper.findAll('li').length).toBe(7);
        expect(wrapper.findAll('li').at(0).element.classList).toContain('active');
    });

    it('has correct DOM structure with -1 limit on page 2', function() {
        exampleData.current_page = 2;
        exampleData.next_page_url = 'http://example.com/page/3';
        exampleData.prev_page_url = 'http://example.com/page/1';

        const wrapper = getComponent(LaravelVuePagination, {
            data: exampleData,
            limit: -1
        });

        expect(wrapper.contains('ul')).toBe(true);
        expect(wrapper.findAll('li').length).toBe(2);
    });

    it('has correct DOM structure with 1 link limit on page 5', function() {
        exampleData.current_page = 5;
        exampleData.last_page = 11;
        exampleData.per_page = 1;
        exampleData.next_page_url = 'http://example.com/page/6';
        exampleData.prev_page_url = 'http://example.com/page/4';

        const wrapper = getComponent(LaravelVuePagination, {
            data: exampleData,
            limit: 1
        });

        expect(wrapper.contains('ul')).toBe(true);
        expect(wrapper.findAll('li').length).toBe(9);
        expect(wrapper.findAll('li').at(4).element.classList).toContain('active');
    });

    it('has correct DOM structure when on page 2', function() {
        exampleData.current_page = 2;
        exampleData.last_page = 6;
        exampleData.per_page = 2;
        exampleData.next_page_url = 'http://example.com/page/3';
        exampleData.prev_page_url = 'http://example.com/page/1';

        const wrapper = getComponent(LaravelVuePagination, {
            data: exampleData
        });

        expect(wrapper.findAll('li').length).toBe(8);
        expect(wrapper.findAll('li').at(2).element.classList).toContain('active');
    });

    it('emits correct event', function(done) {
        const wrapper = getComponent(LaravelVuePagination, {
            data: exampleData
        });

        wrapper.vm.$on('pagination-change-page', function (page) {
            expect(page).toBe(2);
            done();
        });

        wrapper.findAll('li').at(2).find('a').trigger('click');
    });

    it('has correct DOM structure when using slots', function() {
        const wrapper = mount(LaravelVuePagination, {
            propsData: { data: exampleData },
            slots: {
                'prev-nav': '<span class="custom-prev-nav">Previous</span>',
                'next-nav': '<span>Next</span>'
            }
        });

        expect(wrapper.html()).toContain('<span class="custom-prev-nav">Previous</span>');
        expect(wrapper.html()).toContain('<span>Next</span>');
    });
});